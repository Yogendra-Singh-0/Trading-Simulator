from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import threading
import sys
import os

# Add local directory to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from trading_simulator import TradingApp

app = FastAPI(title="Trading Simulator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

trading_app = None

@app.on_event("startup")
def startup_event():
    global trading_app
    trading_app = TradingApp()
    # Start the market simulation thread
    trading_app.market.start_market_updates()

@app.on_event("shutdown")
def shutdown_event():
    global trading_app
    if trading_app:
        trading_app.market.stop_market_updates()
        trading_app.save_data()

@app.get("/api/market")
def get_market_prices():
    prices = []
    for stock in trading_app.market.stocks.values():
        prices.append({
            "symbol": stock.symbol,
            "name": stock.name,
            "current_price": stock.current_price,
            "history": stock.price_history
        })
    return {"stocks": prices}

@app.get("/api/portfolio")
def get_portfolio():
    portfolio = trading_app.portfolio
    stocks_ref = trading_app.market.stocks
    holdings = []
    for symbol, quantity in portfolio.holdings.items():
        if symbol in stocks_ref:
            stock = stocks_ref[symbol]
            current_value = stock.current_price * quantity
            holdings.append({
                "symbol": symbol,
                "quantity": quantity,
                "current_price": stock.current_price,
                "total_value": current_value
            })
    
    return {
        "cash": portfolio.cash,
        "initial_cash": portfolio.initial_cash,
        "portfolio_value": portfolio.get_portfolio_value(stocks_ref),
        "total_return": portfolio.get_total_return(stocks_ref),
        "holdings": holdings
    }

class TradeRequest(BaseModel):
    symbol: str
    quantity: int

@app.post("/api/buy")
def buy_stock(req: TradeRequest):
    symbol = req.symbol.upper()
    if symbol not in trading_app.market.stocks:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    stock = trading_app.market.stocks[symbol]
    if trading_app.portfolio.buy_stock(stock, req.quantity):
        trading_app.save_data()
        return {"success": True, "message": f"Bought {req.quantity} of {symbol}"}
    else:
        raise HTTPException(status_code=400, detail="Insufficient funds")

@app.post("/api/sell")
def sell_stock(req: TradeRequest):
    symbol = req.symbol.upper()
    if symbol not in trading_app.market.stocks:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    stock = trading_app.market.stocks[symbol]
    if trading_app.portfolio.sell_stock(stock, req.quantity):
        trading_app.save_data()
        return {"success": True, "message": f"Sold {req.quantity} of {symbol}"}
    else:
        raise HTTPException(status_code=400, detail="Insufficient shares")

@app.get("/api/history")
def get_history():
    history = []
    for tx in trading_app.portfolio.transaction_history:
        history.append({
            "type": tx["type"],
            "symbol": tx["symbol"],
            "quantity": tx["quantity"],
            "price": tx["price"],
            "total": tx["total"],
            "timestamp": tx["timestamp"].isoformat()
        })
    return {"history": list(reversed(history))}
