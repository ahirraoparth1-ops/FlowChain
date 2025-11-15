from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from prophet import Prophet
import pandas as pd
import io

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
async def forecast(file: UploadFile = File(...)):
    # Read uploaded file into pandas DataFrame
    contents = await file.read()

    df = pd.read_csv(io.BytesIO(contents))

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
        forecasts = []
        for product, group in df.groupby('product'):
            if not {'date', 'sales'}.issubset(group.columns):
                continue
            group = group.copy()
            # Date already converted above
            if group['date'].dtype != 'datetime64[ns]':
                group['date'] = pd.to_datetime(group['date'], errors='coerce')
            group = group.rename(columns={'date': 'ds', 'sales': 'y'})
            model = Prophet()
            try:
                model.fit(group)
                future = model.make_future_dataframe(periods=12, freq='M')
                forecast = model.predict(future)
                result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12)
                result = result.rename(columns={'ds': 'date', 'yhat': 'forecast'})
                result['date'] = result['date'].dt.strftime('%Y-%m')
                forecasts.append({
                    'product': product,
                    'forecast': result.to_dict(orient='records')
                })
            except Exception as e:
                forecasts.append({
                    'product': product,
                    'error': str(e)
                })
        if not forecasts:
            return {"error": "No valid product time series found in CSV."}
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
    
    # Date already converted above, but ensure it's datetime
    if df['date'].dtype != 'datetime64[ns]':
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
    
    # Remove rows with invalid dates
    df = df.dropna(subset=['date', 'sales'])
    df = df.rename(columns={'date': 'ds', 'sales': 'y'})
    model = Prophet()
    model.fit(df)
    future = model.make_future_dataframe(periods=12, freq='M')
    forecast = model.predict(future)
    result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(12)
    result = result.rename(columns={'ds': 'date', 'yhat': 'forecast'})
    result['date'] = result['date'].dt.strftime('%Y-%m')
    return {"forecast": result.to_dict(orient='records')}

@app.get("/")
def root():
    return {"message": "Forecast API is running!"}
