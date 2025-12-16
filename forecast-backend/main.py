from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from prophet import Prophet
import pandas as pd
import io
import logging
from contextlib import contextmanager
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from sklearn.linear_model import LinearRegression
import numpy as np
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def convert_numpy_types(obj):
    """Convert NumPy types to native Python types for JSON serialization"""
    if isinstance(obj, (np.integer, np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64, np.float32, np.float16)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [convert_numpy_types(item) for item in obj]
    elif pd.isna(obj):
        return None
    return obj

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Performance timing context manager
@contextmanager
def timing_context(operation_name):
    start = time.time()
    logger.info(f"[TIMING] Starting: {operation_name}")
    try:
        yield
    finally:
        elapsed = time.time() - start
        logger.info(f"[TIMING] Completed: {operation_name} in {elapsed:.2f}s")

def time_function(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        logger.info(f"[TIMING] {func.__name__} took {elapsed:.2f}s")
        return result
    return wrapper

def fit_fast_model(group_data):
    """Fast forecasting using Linear Regression - suitable for large datasets"""
    try:
        group = group_data.copy()
        if 'date' not in group.columns:
            logger.error("[FAST_MODEL] Missing 'date' column")
            return None
        if 'sales' not in group.columns:
            logger.error("[FAST_MODEL] Missing 'sales' column")
            return None
        
        # Filter to only required columns to avoid categorical column issues
        group = group[['date', 'sales']].copy()
        
        # Ensure sales column is numeric (convert if needed)
        group['sales'] = pd.to_numeric(group['sales'], errors='coerce')
        
        group = group.sort_values('date')
        group = group.dropna(subset=['date', 'sales'])
        
        if len(group) < 3:
            return None
        
        # Convert dates to numeric (days since first date)
        group['days'] = (group['date'] - group['date'].min()).dt.days
        X = group[['days']].values
        y = group['sales'].values
        
        # Ensure y is numeric and convert to float
        y = pd.to_numeric(y, errors='coerce')
        y = y.astype(float)
        
        # Remove any remaining NaN values (shouldn't happen, but safety check)
        valid_mask = ~np.isnan(y)
        X = X[valid_mask]
        y = y[valid_mask]
        
        if len(y) < 3:
            logger.error("[FAST_MODEL] Insufficient valid data points after cleaning")
            return None
        
        # Fit linear regression
        model = LinearRegression()
        model.fit(X, y)
        
        # Generate future dates (12 months ahead)
        last_date = group['date'].max()
        future_dates = pd.date_range(start=last_date, periods=13, freq='M')[1:]  # Skip first (same as last)
        
        # Predict
        future_days = [(d - group['date'].min()).days for d in future_dates]
        future_X = np.array(future_days).reshape(-1, 1)
        predictions = model.predict(future_X)
        
        # Calculate confidence intervals (simple approach)
        residuals = y - model.predict(X)
        std_error = np.std(residuals) if len(residuals) > 0 else np.std(y) * 0.1
        
        result = pd.DataFrame({
            'date': future_dates,
            'forecast': predictions,
            'yhat_lower': predictions - 1.96 * std_error,
            'yhat_upper': predictions + 1.96 * std_error
        })
        
        return result
    except Exception as e:
        logger.error(f"[FAST_MODEL] Error: {str(e)}")
        return None

def fit_prophet_model(group_data):
    """Prophet forecasting - more accurate but slower"""
    try:
        group = group_data.copy()
        if 'date' not in group.columns or 'sales' not in group.columns:
            logger.error("[PROPHET] Missing required columns")
            return None
        group = group.sort_values('date')
        group = group.dropna(subset=['date', 'sales'])
        
        if len(group) < 3:
            return None
        
        group = group.rename(columns={'date': 'ds', 'sales': 'y'})
        
        # Configure Prophet for faster execution
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            mcmc_samples=0,  # Disable MCMC for speed
            interval_width=0.8
        )
        
        model.fit(group)
        future = model.make_future_dataframe(periods=12, freq='M')
        forecast = model.predict(future)
        
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12)
        result = result.rename(columns={'ds': 'date', 'yhat': 'forecast'})
        
        return result
    except Exception as e:
        logger.error(f"[PROPHET] Error: {str(e)}")
        return None

def process_product(product_data):
    """Process a single product's forecast"""
    product, group = product_data
    try:
        if not {'date', 'sales'}.issubset(group.columns):
            return {'product': product, 'error': 'Missing required columns'}
        
        group = group.copy()
        if 'date' not in group.columns:
            return {'product': product, 'error': 'Missing date column'}
        if group['date'].dtype != 'datetime64[ns]':
            group['date'] = pd.to_datetime(group['date'], errors='coerce')
        
        # Ensure sales column is numeric before processing
        group['sales'] = pd.to_numeric(group['sales'], errors='coerce')
        
        group = group.dropna(subset=['date', 'sales'])
        
        if len(group) < 3:
            return {'product': product, 'error': 'Insufficient data points'}
        
        # Use fast model for large datasets
        result = fit_fast_model(group)
        
        if result is None:
            return {'product': product, 'error': 'Forecast failed'}
        
        result['date'] = result['date'].dt.strftime('%Y-%m')
        forecast_dict = result[['date', 'forecast', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
        # Convert NumPy types to native Python types
        forecast_dict = convert_numpy_types(forecast_dict)
        return {
            'product': str(product),  # Ensure product name is string
            'forecast': forecast_dict
        }
    except Exception as e:
        logger.error(f"[PRODUCT] Error processing {product}: {str(e)}")
        return {'product': product, 'error': str(e)}

@app.post("/forecast")
async def forecast(file: UploadFile = File(...)):
    try:
        with timing_context("Total Request Processing"):
            # Read uploaded file
            with timing_context("CSV Read"):
                contents = await file.read()
                df = pd.read_csv(io.BytesIO(contents))
                original_total_rows = len(df)
                logger.info(f"[DATA] Loaded CSV: {original_total_rows} rows, {len(df.columns)} columns")
                logger.info(f"[DATA] Column names: {list(df.columns)}")
            
            # Optimized single-pass column detection with YEAR+MONTH support
            with timing_context("Column Detection"):
                col_map = {}
                date_found = False
                sales_found = False
                product_found = False
                year_found = False
                month_found = False
                
                # Check for YEAR and MONTH columns first (before other date detection)
                for col in df.columns:
                    col_lower = col.lower().strip()
                    if col_lower == 'year' and not year_found:
                        col_map[col] = 'year'
                        year_found = True
                    elif col_lower == 'month' and not month_found:
                        col_map[col] = 'month'
                        month_found = True
                
                # Enhanced date column detection
                date_keywords = ['date', 'day', 'timestamp', 'order_date', 'period', 'sale_date', 
                               'time', 'datetime', 'week', 'transaction_date',
                               'purchase_date', 'invoice_date', 'delivery_date']
                
                # Enhanced sales/quantity column detection
                sales_keywords = ['sales', 'quantity', 'qty', 'amount', 'revenue', 'value', 
                                'units_sold', 'sales_amount', 'total', 'price', 'cost', 'sum',
                                'volume', 'count', 'num', 'number', 'units', 'qty_sold',
                                'retail sales', 'warehouse sales']
                
                # Enhanced product column detection
                product_keywords = ['item', 'product', 'product_id', 'product_name', 'sku', 
                                  'item_id', 'item_name', 'description', 'product_desc', 
                                  'item_code', 'product_code']
                
                for col in df.columns:
                    if col in col_map:
                        continue
                    
                    col_lower = col.lower().strip()
                    
                    # Check for date columns
                    if not date_found and any(keyword in col_lower for keyword in date_keywords):
                        col_map[col] = 'date'
                        date_found = True
                    # Check if column name is just a year
                    elif not date_found and col.isdigit() and len(col) == 4 and 1900 <= int(col) <= 2100:
                        col_map[col] = 'date'
                        date_found = True
                    # Check for sales/quantity columns
                    elif not sales_found and any(keyword in col_lower for keyword in sales_keywords):
                        col_map[col] = 'sales'
                        sales_found = True
                    # Check for product columns
                    elif not product_found and any(keyword in col_lower for keyword in product_keywords):
                        col_map[col] = 'product'
                        product_found = True
                
                # Fallback: if no date column found, try numeric year columns
                if not date_found:
                    for col in df.columns:
                        if col not in col_map and col.isdigit() and len(col) == 4:
                            try:
                                year = int(col)
                                if 1900 <= year <= 2100:
                                    col_map[col] = 'date'
                                    date_found = True
                                    break
                            except:
                                pass
                
                # Fallback: if no sales column found, try first numeric column
                if not sales_found:
                    for col in df.columns:
                        if col not in col_map and df[col].dtype in ['int64', 'float64']:
                            try:
                                sample = df[col].dropna().head(10)
                                if len(sample) > 0 and pd.api.types.is_numeric_dtype(sample):
                                    col_map[col] = 'sales'
                                    sales_found = True
                                    break
                            except:
                                pass
                
                # Handle multiple sales columns - sum them
                sales_cols = [col for col in df.columns if any(kw in col.lower() for kw in ['sales', 'retail', 'warehouse', 'quantity'])]
                if len(sales_cols) > 1 and 'sales' not in col_map.values():
                    logger.info(f"[DATA] Found multiple sales columns: {sales_cols}, will sum them")
                    df['_combined_sales'] = df[sales_cols].sum(axis=1, skipna=True)
                    col_map['_combined_sales'] = 'sales'
                    sales_found = True
            
            # Handle YEAR+MONTH date format (combine into date column) - BEFORE renaming
            # Find original year and month column names (case-insensitive)
            original_year_col = None
            original_month_col = None
            for col in df.columns:
                col_lower = col.lower().strip()
                if col_lower == 'year' and original_year_col is None:
                    original_year_col = col
                elif col_lower == 'month' and original_month_col is None:
                    original_month_col = col
            
            # If we found year and month columns, and no date column was detected, combine them
            if original_year_col and original_month_col and not date_found:
                logger.info(f"[DATA] Combining YEAR ({original_year_col}) and MONTH ({original_month_col}) columns into date")
                try:
                    # Ensure year and month are numeric
                    df[original_year_col] = pd.to_numeric(df[original_year_col], errors='coerce')
                    df[original_month_col] = pd.to_numeric(df[original_month_col], errors='coerce')
                    
                    # Create date column directly (don't rename year/month first)
                    df['date'] = pd.to_datetime({
                        'year': df[original_year_col],
                        'month': df[original_month_col],
                        'day': 1
                    }, errors='coerce')
                    
                    # Remove year and month from col_map so they don't get renamed
                    if original_year_col in col_map:
                        del col_map[original_year_col]
                    if original_month_col in col_map:
                        del col_map[original_month_col]
                    
                    # Drop the original year and month columns after creating date
                    df = df.drop(columns=[original_year_col, original_month_col], errors='ignore')
                    
                    valid_dates = len(df[df['date'].notna()])
                    logger.info(f"[DATA] Created date column from YEAR+MONTH: {valid_dates} valid dates out of {len(df)} rows")
                    date_found = True  # Mark date as found
                    
                    if valid_dates == 0:
                        return {"error": "Could not create valid dates from YEAR and MONTH columns. Please check that year and month values are valid."}
                except Exception as e:
                    logger.error(f"[DATA] Failed to combine YEAR+MONTH: {str(e)}")
                    return {"error": f"Could not combine YEAR and MONTH columns: {str(e)}"}
            
            # Store original date column name before renaming
            original_date_col = None
            if 'date' in col_map.values():
                original_date_col = [k for k, v in col_map.items() if v == 'date'][0]
                # Check if it's a year-only column before renaming
                if original_date_col in df.columns:
                    sample_val = df[original_date_col].dropna().iloc[0] if len(df[original_date_col].dropna()) > 0 else None
                    if sample_val is not None:
                        try:
                            year_val = int(sample_val) if pd.notna(sample_val) else None
                            if year_val and 1900 <= year_val <= 2100 and len(str(year_val)) == 4:
                                df[original_date_col] = pd.to_datetime(df[original_date_col].astype(str) + '-01-01', errors='coerce')
                        except:
                            pass
            
            df = df.rename(columns=col_map)
            
            # Handle date column conversion
            if 'date' not in df.columns:
                # Check if we have year/month columns that weren't combined
                if 'year' in df.columns or 'month' in df.columns:
                    logger.warning("[DATA] YEAR/MONTH columns found but date column missing after mapping")
                # Log available columns for debugging
                logger.error(f"[DATA] Date column not found after mapping. Available columns: {list(df.columns)}")
                available_cols = list(df.columns)
                return {"error": f"Could not detect a date column in your CSV. Please ensure your CSV contains a date/time column. Found columns: {', '.join(available_cols[:10])}"}
            
            try:
                if df['date'].dtype != 'datetime64[ns]':
                    df['date'] = pd.to_datetime(df['date'], errors='coerce')
                if df['date'].isna().all():
                    return {"error": "Could not parse date column. Please ensure dates are in a recognizable format (YYYY-MM-DD, YYYY, etc.)"}
            except Exception as e:
                logger.error(f"[DATA] Date conversion error: {str(e)}")
                return {"error": f"Could not parse date column: {str(e)}"}
            
            # Aggregate data for large files (monthly aggregation)
            if original_total_rows > 100000 and 'date' in df.columns:
                with timing_context("Monthly Data Aggregation"):
                    logger.info(f"[DATA] Large file detected. Aggregating {len(df)} rows to monthly totals")
                    try:
                        df['year_month'] = df['date'].dt.to_period('M')
                        agg_dict = {'sales': 'sum'}
                        if 'product' in df.columns:
                            df_agg = df.groupby(['product', 'year_month']).agg(agg_dict).reset_index()
                            df_agg['date'] = pd.to_datetime(df_agg['year_month'].astype(str))
                        else:
                            df_agg = df.groupby('year_month').agg(agg_dict).reset_index()
                            df_agg['date'] = pd.to_datetime(df_agg['year_month'].astype(str))
                        df_agg = df_agg.drop(columns=['year_month'], errors='ignore')
                        df = df_agg
                        logger.info(f"[DATA] Aggregated to {len(df)} monthly records (reduced from {original_total_rows} rows)")
                    except Exception as e:
                        logger.warning(f"[DATA] Aggregation failed, continuing with original data: {str(e)}")
            
            # If product column exists, do multi-product forecasting
            if 'product' in df.columns:
                with timing_context("Multi-Product Forecasting"):
                    products = df['product'].unique()
                    logger.info(f"[FORECAST] Processing {len(products)} products")
                    
                    # Prepare product groups
                    product_groups = [(p, df[df['product'] == p].copy()) for p in products]
                    
                    # Use parallel processing for multiple products
                    forecasts = []
                    if len(products) > 1:
                        with ThreadPoolExecutor(max_workers=10) as executor:
                            futures = {executor.submit(process_product, pg): pg[0] for pg in product_groups}
                            for future in as_completed(futures):
                                try:
                                    result = future.result()
                                    forecasts.append(result)
                                except Exception as e:
                                    product_name = futures[future]
                                    logger.error(f"[FORECAST] Error processing {product_name}: {str(e)}")
                                    forecasts.append({'product': product_name, 'error': str(e)})
                    else:
                        # Single product - no need for threading
                        for pg in product_groups:
                            result = process_product(pg)
                            forecasts.append(result)
                    
                    if not forecasts:
                        return {"error": "No valid product time series found in CSV."}
                    
                    logger.info(f"[FORECAST] Completed {len(forecasts)} product forecasts")
                    # Convert NumPy types in forecasts list
                    forecasts = convert_numpy_types(forecasts)
                    return {"forecasts": forecasts}
            
            # Otherwise, do single time series forecasting
            if not {'date', 'sales'}.issubset(df.columns):
                available_cols = list(df.columns)
                missing = []
                if 'date' not in df.columns:
                    missing.append("date column (e.g. date, day, timestamp, year)")
                if 'sales' not in df.columns:
                    missing.append("sales column (e.g. sales, quantity, amount, revenue)")
                return {"error": f"CSV must contain a {' and '.join(missing)}. Found columns: {', '.join(available_cols[:10])}"}
            
            with timing_context("Single Time Series Forecasting"):
                if df['date'].dtype != 'datetime64[ns]':
                    df['date'] = pd.to_datetime(df['date'], errors='coerce')
                
                # Ensure sales column is numeric before processing
                df['sales'] = pd.to_numeric(df['sales'], errors='coerce')
                
                df = df.dropna(subset=['date', 'sales'])
                
                if len(df) < 3:
                    return {"error": "Insufficient data points for forecasting"}
                
                # Use fast model for large datasets
                result = fit_fast_model(df)
                
                if result is None:
                    return {"error": "Forecast generation failed"}
                
                result['date'] = result['date'].dt.strftime('%Y-%m')
                forecast_dict = result[['date', 'forecast', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
                # Convert NumPy types to native Python types
                forecast_dict = convert_numpy_types(forecast_dict)
                return {"forecast": forecast_dict}
    
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        logger.error(f"[ERROR] Forecast endpoint error: {str(e)}")
        logger.error(f"[ERROR] Traceback: {error_trace}")
        return {"error": f"An error occurred: {str(e)}"}

@app.get("/")
def root():
    return {
        "message": "Forecast API is running!",
        "optimizations": [
            "Parallel processing for multiple products",
            "Fast Linear Regression model for large datasets",
            "Automatic monthly aggregation for files >100K rows",
            "Enhanced column detection with YEAR+MONTH support",
            "Performance timing and logging"
        ]
    }

 
 @ a p p . g e t ( " / h e a l t h z " ) 
 d e f   h e a l t h z ( ) : 
         r e t u r n   { " s t a t u s " :   " o k " } 
  
 