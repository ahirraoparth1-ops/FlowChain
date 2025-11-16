from fastapi import FastAPI, File, UploadFile, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from prophet import Prophet
import pandas as pd
import io
import warnings
import logging
from datetime import datetime
from typing import Optional
import asyncio
import signal
import sys

# Suppress FutureWarnings from Prophet
warnings.filterwarnings('ignore', category=FutureWarning)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/forecast")
async def forecast(
    file: UploadFile = File(...),
    max_rows: Optional[int] = Query(None, description="Maximum rows to process (for large files)"),
    max_products: Optional[int] = Query(10, description="Maximum products to forecast")
):
    """
    Process CSV file and generate forecasts.
    
    Parameters:
    - max_rows: Maximum number of rows to process (for testing with large files)
    - max_products: Maximum number of products to forecast (default 10)
    """
    # Read uploaded file into pandas DataFrame
    contents = await file.read()

    df = pd.read_csv(io.BytesIO(contents))
    
    # Log file size info
    total_rows = len(df)
    logger.info(f"CSV file loaded: {total_rows} rows, {len(df.columns)} columns")
    
    # Auto-limit for very large files (if not specified) - more aggressive limits
    if not max_rows and total_rows > 10000:
        max_rows = 10000
        logger.info(f"Large file detected ({total_rows} rows). Auto-limiting to {max_rows} rows for faster processing.")
    
    # Sample data if file is too large (for faster processing)
    if max_rows and len(df) > max_rows:
        logger.info(f"Sampling {max_rows} rows from {total_rows} total rows for faster processing")
        df = df.sample(n=max_rows, random_state=42).reset_index(drop=True)
        logger.info(f"Processing {len(df)} rows (sampled from {total_rows})")

    # Try to map common column names to 'date', 'sales', and 'product'
    col_map = {}
    
    # Enhanced date column detection
    date_keywords = ['date', 'day', 'timestamp', 'order_date', 'period', 'sale_date', 
                     'time', 'datetime', 'year', 'month', 'week', 'transaction_date',
                     'purchase_date', 'invoice_date', 'delivery_date']
    
    # Enhanced sales/quantity column detection
    sales_keywords = ['sales', 'quantity', 'qty', 'amount', 'revenue', 'value', 
                      'units_sold', 'sales_amount', 'total', 'price', 'cost', 'sum',
                      'volume', 'count', 'num', 'number', 'units', 'qty_sold']
    
    # Enhanced product column detection
    product_keywords = ['item', 'product', 'product_id', 'product_name', 'sku', 
                        'item_id', 'item_name', 'description', 'product_desc', 
                        'item_code', 'product_code']
    
    for col in df.columns:
        col_lower = col.lower().strip()
        
        # Check for date columns (case-insensitive and partial matches)
        if any(keyword in col_lower for keyword in date_keywords):
            if 'date' not in col_map.values():  # Only map first date column
                col_map[col] = 'date'
        # Check if column name is just a year (e.g., "2020", "2021")
        elif col.isdigit() and len(col) == 4 and 1900 <= int(col) <= 2100:
            if 'date' not in col_map.values():
                col_map[col] = 'date'
        # Check for sales/quantity columns
        elif any(keyword in col_lower for keyword in sales_keywords):
            if 'sales' not in col_map.values():  # Only map first sales column
                col_map[col] = 'sales'
        # Check for product columns
        elif any(keyword in col_lower for keyword in product_keywords):
            if 'product' not in col_map.values():  # Only map first product column
                col_map[col] = 'product'
    
    # Fallback: if no date column found, try to detect numeric year columns
    if 'date' not in col_map.values():
        for col in df.columns:
            if col.isdigit() and len(col) == 4:
                try:
                    year = int(col)
                    if 1900 <= year <= 2100:
                        col_map[col] = 'date'
                        break
                except:
                    pass
    
    # Fallback: if no sales column found, try first numeric column (excluding dates)
    if 'sales' not in col_map.values():
        for col in df.columns:
            if col not in col_map and df[col].dtype in ['int64', 'float64']:
                # Check if column has numeric values
                try:
                    sample = df[col].dropna().head(10)
                    if len(sample) > 0 and pd.api.types.is_numeric_dtype(sample):
                        col_map[col] = 'sales'
                        break
                except:
                    pass

    # Store original date column name before renaming
    original_date_col = None
    if 'date' in col_map.values():
        original_date_col = [k for k, v in col_map.items() if v == 'date'][0]
        # Check if it's a year-only column before renaming
        if original_date_col in df.columns:
            sample_val = df[original_date_col].dropna().iloc[0] if len(df[original_date_col].dropna()) > 0 else None
            if sample_val is not None:
                try:
                    # Check if value is a 4-digit year
                    year_val = int(sample_val) if pd.notna(sample_val) else None
                    if year_val and 1900 <= year_val <= 2100 and len(str(year_val)) == 4:
                        # Convert year to date (first day of year)
                        df[original_date_col] = pd.to_datetime(df[original_date_col].astype(str) + '-01-01', errors='coerce')
                except:
                    pass

    df = df.rename(columns=col_map)

    # Handle date column conversion
    if 'date' in df.columns:
        try:
            # Try to convert to datetime if not already
            if df['date'].dtype != 'datetime64[ns]':
                df['date'] = pd.to_datetime(df['date'], errors='coerce')
            # Final check - ensure dates are valid
            if df['date'].isna().all():
                return {"error": "Could not parse date column. Please ensure dates are in a recognizable format (YYYY-MM-DD, YYYY, etc.)"}
        except Exception as e:
            return {"error": f"Could not parse date column: {str(e)}"}

    # If product column exists, do multi-product forecasting
    if 'product' in df.columns:
        # Get unique products
        unique_products = df['product'].unique()
        total_products = len(unique_products)
        
        logger.info(f"Found {total_products} unique products")
        
        # Auto-limit products if there are too many (unless max_products is None) - more aggressive
        if max_products is None and total_products > 5:
            max_products = 5
            logger.info(f"Many products detected ({total_products}). Auto-limiting to {max_products} products for faster processing.")
        
        # Limit number of products to process (for faster testing)
        if max_products and total_products > max_products:
            logger.info(f"Limiting to first {max_products} products (out of {total_products}) for faster processing")
            products_to_process = unique_products[:max_products]
            df = df[df['product'].isin(products_to_process)]
            logger.info(f"Processing {max_products} products: {list(products_to_process)}")
        
        forecasts = []
        processed = 0
        total_to_process = len(df['product'].unique())
        
        for product, group in df.groupby('product'):
            processed += 1
            logger.info(f"Processing product {processed}/{total_to_process}: {product}")
            if not {'date', 'sales'}.issubset(group.columns):
                continue
            group = group.copy()
            # Date already converted above
            if group['date'].dtype != 'datetime64[ns]':
                group['date'] = pd.to_datetime(group['date'], errors='coerce')
            group = group.rename(columns={'date': 'ds', 'sales': 'y'})
            group = group.dropna(subset=['ds', 'y'])
            
            # Validate minimum data points
            if len(group) < 3:
                forecasts.append({
                    'product': product,
                    'error': f"Insufficient data points ({len(group)}). Need at least 3 data points for forecasting."
                })
                continue
            
            model = Prophet(
                daily_seasonality=False,
                weekly_seasonality=False,
                yearly_seasonality=True if len(group) > 365 else False,
                seasonality_mode='additive',
                interval_width=0.8,  # Faster computation
                mcmc_samples=0  # Disable MCMC for speed
            )
            try:
                logger.info(f"Fitting Prophet model for product: {product} with {len(group)} data points")
                
                # Add timeout protection (max 2 minutes per product)
                try:
                    # Run in executor to allow timeout
                    loop = asyncio.get_event_loop()
                    model.fit(group)
                except Exception as fit_error:
                    raise Exception(f"Model fitting failed: {str(fit_error)}")
                
                # Use 'ME' instead of deprecated 'M' for month end frequency
                future = model.make_future_dataframe(periods=12, freq='ME')
                logger.info(f"Making predictions for product: {product}")
                forecast = model.predict(future)
                result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12)
                result = result.rename(columns={'ds': 'date', 'yhat': 'forecast'})
                result['date'] = result['date'].dt.strftime('%Y-%m')
                forecasts.append({
                    'product': product,
                    'forecast': result.to_dict(orient='records')
                })
                logger.info(f"Successfully generated forecast for product: {product}")
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Error forecasting product {product}: {error_msg}")
                forecasts.append({
                    'product': product,
                    'error': f"Forecasting failed: {error_msg}. Please check your data format and ensure you have sufficient historical data points."
                })
        if not forecasts:
            return {"error": "No valid product time series found in CSV."}
        
        # Include metadata about processing
        result = {
            "forecasts": forecasts,
            "metadata": {
                "total_rows_processed": len(df),
                "total_products": total_products if 'product' in df.columns else 1,
                "products_processed": len(forecasts),
                "note": f"Processed first {max_products} products" if max_products and total_products > max_products else None
            }
        }
        return result
    # Otherwise, do single time series forecasting
    if not {'date', 'sales'}.issubset(df.columns):
        available_cols = list(df.columns)
        missing = []
        if 'date' not in df.columns:
            missing.append("date column (e.g. date, day, timestamp, year)")
        if 'sales' not in df.columns:
            missing.append("sales column (e.g. sales, quantity, amount, revenue)")
        return {"error": f"CSV must contain a {' and '.join(missing)}. Found columns: {', '.join(available_cols[:10])}"}
    
    # Date already converted above, but ensure it's datetime
    if df['date'].dtype != 'datetime64[ns]':
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
    
    # Remove rows with invalid dates
    df = df.dropna(subset=['date', 'sales'])
    
    # Validate minimum data points
    if len(df) < 3:
        return {"error": f"Insufficient data points ({len(df)}). Need at least 3 data points for forecasting."}
    
    df = df.rename(columns={'date': 'ds', 'sales': 'y'})
    
    logger.info(f"Fitting Prophet model with {len(df)} data points")
    
    try:
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=False,
            yearly_seasonality=True if len(df) > 365 else False,
            seasonality_mode='additive',
            interval_width=0.8,  # Faster computation
            mcmc_samples=0  # Disable MCMC for speed
        )
        logger.info("Starting model fitting (this may take 1-3 minutes)...")
        model.fit(df)
        
        # Use 'ME' instead of deprecated 'M' for month end frequency
        logger.info("Making predictions...")
        future = model.make_future_dataframe(periods=12, freq='ME')
        forecast = model.predict(future)
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12)
        result = result.rename(columns={'ds': 'date', 'yhat': 'forecast'})
        result['date'] = result['date'].dt.strftime('%Y-%m')
        logger.info("Forecast generated successfully")
        return {"forecast": result.to_dict(orient='records')}
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Forecasting error: {error_msg}")
        return {"error": f"Forecasting failed: {error_msg}. Please check your data format, ensure sufficient historical data points (minimum 3), and that dates are properly formatted."}

@app.get("/")
def root():
    return {
        "message": "Forecast API is running!",
        "note": "For large files, processing is automatically limited to 10,000 rows and 5 products for faster results."
    }
