import json
import random
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import threading
import os

class Stock:
    def __init__(self, symbol: str, name: str, initial_price: float):
        self.symbol = symbol
        self.name = name
        self.current_price = initial_price
        self.price_history = [initial_price]
        self.last_update = datetime.now()
        
    def update_price(self):
        """Simulate price movement with random walk"""
        # Random price change between -5% to +5%
        change_percent = random.uniform(-0.05, 0.05)
        price_change = self.current_price * change_percent
        self.current_price = max(0.01, self.current_price + price_change)  # Minimum price of $0.01
        self.price_history.append(self.current_price)
        self.last_update = datetime.now()
        
        # Keep only last 100 price points to avoid memory issues
        if len(self.price_history) > 100:
            self.price_history.pop(0)

class Portfolio:
    def __init__(self, initial_cash: float = 10000.0):
        self.cash = initial_cash
        self.initial_cash = initial_cash
        self.holdings: Dict[str, int] = {}  # symbol -> quantity
        self.transaction_history: List[Dict] = []
        
    def buy_stock(self, stock: Stock, quantity: int) -> bool:
        """Buy stocks if enough cash available"""
        total_cost = stock.current_price * quantity
        if total_cost <= self.cash:
            self.cash -= total_cost
            if stock.symbol in self.holdings:
                self.holdings[stock.symbol] += quantity
            else:
                self.holdings[stock.symbol] = quantity
                
            # to Record transaction
            self.transaction_history.append({
                'type': 'BUY',
                'symbol': stock.symbol,
                'quantity': quantity,
                'price': stock.current_price,
                'total': total_cost,
                'timestamp': datetime.now()
            })
            return True
        return False
    
    def sell_stock(self, stock: Stock, quantity: int) -> bool:
        """Sell stocks if enough shares owned"""
        if stock.symbol in self.holdings and self.holdings[stock.symbol] >= quantity:
            total_value = stock.current_price * quantity
            self.cash += total_value
            self.holdings[stock.symbol] -= quantity
            
            # Remove from holdings if quantity becomes 0
            if self.holdings[stock.symbol] == 0:
                del self.holdings[stock.symbol]
                
            # Record transaction
            self.transaction_history.append({
                'type': 'SELL',
                'symbol': stock.symbol,
                'quantity': quantity,
                'price': stock.current_price,
                'total': total_value,
                'timestamp': datetime.now()
            })
            return True
        return False
    
    def get_portfolio_value(self, stocks: Dict[str, Stock]) -> float:
        """Calculate total portfolio value (cash + holdings)"""
        holdings_value = 0
        for symbol, quantity in self.holdings.items():
            if symbol in stocks:
                holdings_value += stocks[symbol].current_price * quantity
        return self.cash + holdings_value
    
    def get_total_return(self, stocks: Dict[str, Stock]) -> float:
        """Calculate total return percentage"""
        current_value = self.get_portfolio_value(stocks)
        return ((current_value - self.initial_cash) / self.initial_cash) * 100

class MarketSimulator:
    def __init__(self):
        self.stocks = {
            'APPLE': Stock('APPLE', 'Apple Inc.', 150.00),
            'GOOGLE': Stock('GOOGLE', 'Alphabet Inc.', 2500.00),
            'MICROSOFT': Stock('MICROSOFT', 'Microsoft Corp.', 300.00),
            'TESLA': Stock('TESLA', 'Tesla Inc.', 800.00),
            'AMAZON': Stock('AMAZON', 'Amazon.com Inc.', 3200.00),
            'NVIDIA': Stock('NVIDIA', 'NVIDIA Corp.', 220.00),
            'META': Stock('META', 'Meta Platforms Inc.', 320.00),
            'NETFLIX': Stock('NETFLIX', 'Netflix Inc.', 400.00)
        }
        self.running = False
        self.update_thread = None
        
    def start_market_updates(self):
        """Start real-time price updates in a separate thread"""
        self.running = True
        self.update_thread = threading.Thread(target=self._update_prices)
        self.update_thread.daemon = True
        self.update_thread.start()
        
    def stop_market_updates(self):
        """Stop real-time price updates"""
        self.running = False
        if self.update_thread:
            self.update_thread.join()
    
    def _update_prices(self):
        """Update stock prices every 2 seconds"""
        while self.running:
            for stock in self.stocks.values():
                stock.update_price()
            time.sleep(2)  # Update every 2 seconds

class TradingApp:
    def __init__(self):
        self.market = MarketSimulator()
        self.portfolio = Portfolio(10000.0)  # Start with $10,000
        self.data_file = "trading_data.json"
        self.load_data()
        
    def save_data(self):
        """Save portfolio and transaction data"""
        data = {
            'cash': self.portfolio.cash,
            'initial_cash': self.portfolio.initial_cash,
            'holdings': self.portfolio.holdings,
            'transactions': []
        }
        
        # Convert datetime objects to strings for JSON serialization
        for transaction in self.portfolio.transaction_history:
            tx = transaction.copy()
            tx['timestamp'] = transaction['timestamp'].isoformat()
            data['transactions'].append(tx)
            
        try:
            with open(self.data_file, 'w') as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def load_data(self):
        """Load portfolio and transaction data"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    data = json.load(f)
                    
                self.portfolio.cash = data.get('cash', 10000.0)
                self.portfolio.initial_cash = data.get('initial_cash', 10000.0)
                self.portfolio.holdings = data.get('holdings', {})
                
                # Convert timestamp strings back to datetime objects
                for tx in data.get('transactions', []):
                    tx['timestamp'] = datetime.fromisoformat(tx['timestamp'])
                    self.portfolio.transaction_history.append(tx)
        except Exception as e:
            print(f"Error loading data: {e}")
    
    def display_market_prices(self):
        """Display current stock prices"""
        print("\n" + "="*60)
        print("CURRENT MARKET PRICES")
        print("="*60)
        print(f"{'Company':<12} {'Name':<25} {'Price':<12} {'Change'}")
        print("-"*60)
        
        for stock in self.market.stocks.values():
            change = ""
            if len(stock.price_history) >= 2:
                prev_price = stock.price_history[-2]
                change_val = stock.current_price - prev_price
                change_pct = (change_val / prev_price) * 100
                if change_val > 0:
                    change = f"+${change_val:.2f} (+{change_pct:.1f}%)"
                else:
                    change = f"-${abs(change_val):.2f} ({change_pct:.1f}%)"
            
            print(f"{stock.symbol:<12} {stock.name:<25} ${stock.current_price:<11.2f} {change}")
    
    def display_portfolio(self):
        """Display current portfolio"""
        print("\n" + "="*60)
        print("YOUR PORTFOLIO")
        print("="*60)
        print(f"Cash: ${self.portfolio.cash:.2f}")
        
        if self.portfolio.holdings:
            print(f"\nSTOCK HOLDINGS:")
            print(f"{'Company':<12} {'Quantity':<10} {'Avg Cost':<12} {'Current':<12} {'Value':<12} {'P&L'}")
            print("-"*75)
            
            total_value = 0
            total_cost = 0
            
            for company, quantity in self.portfolio.holdings.items():
                if company in self.market.stocks:
                    stock = self.market.stocks[company]
                    current_value = stock.current_price * quantity
                    
                    # Calculate average cost from transaction history
                    total_bought = 0
                    total_spent = 0
                    for tx in self.portfolio.transaction_history:
                        if tx['symbol'] == company and tx['type'] == 'BUY':
                            total_bought += tx['quantity']
                            total_spent += tx['total']
                    
                    avg_cost = total_spent / total_bought if total_bought > 0 else 0
                    cost_basis = avg_cost * quantity
                    pnl = current_value - cost_basis
                    pnl_pct = (pnl / cost_basis * 100) if cost_basis > 0 else 0
                    
                    pnl_str = f"${pnl:.2f} ({pnl_pct:+.1f}%)"
                    if pnl > 0:
                        pnl_str = "+" + pnl_str
                    
                    print(f"{company:<12} {quantity:<10} ${avg_cost:<11.2f} ${stock.current_price:<11.2f} ${current_value:<11.2f} {pnl_str}")
                    
                    total_value += current_value
                    total_cost += cost_basis
            
            portfolio_value = self.portfolio.get_portfolio_value(self.market.stocks)
            total_return = self.portfolio.get_total_return(self.market.stocks)
            
            print("-"*75)
            print(f"Total Portfolio Value: ${portfolio_value:.2f}")
            print(f"Total Return: ${portfolio_value - self.portfolio.initial_cash:.2f} ({total_return:+.2f}%)")
        else:
            print("\nNo stock holdings.")
    
    def buy_stock_interface(self):
        """Interface for buying stocks"""
        print("\n" + "="*40)
        print("BUY STOCKS")
        print("="*40)
        
        company = input("Enter company name (e.g., APPLE): ").upper().strip()
        if company not in self.market.stocks:
            print("Invalid company name!")
            return
        
        stock = self.market.stocks[company]
        print(f"\n{stock.name} ({company})")
        print(f"Current Price: ${stock.current_price:.2f}")
        print(f"Available Cash: ${self.portfolio.cash:.2f}")
        
        try:
            quantity = int(input("Enter quantity to buy: "))
            if quantity <= 0:
                print("Quantity must be positive!")
                return
                
            total_cost = stock.current_price * quantity
            print(f"\nTotal Cost: ${total_cost:.2f}")
            
            if total_cost > self.portfolio.cash:
                print("Insufficient funds!")
                return
            
            confirm = input(f"Confirm purchase? (y/n): ").lower().strip()
            if confirm == 'y':
                if self.portfolio.buy_stock(stock, quantity):
                    print(f"\nSuccessfully bought {quantity} shares of {company}!")
                    self.save_data()
                else:
                    print("Purchase failed!")
            else:
                print("Purchase cancelled.")
                
        except ValueError:
            print("Invalid quantity!")
    
    def sell_stock_interface(self):
        """Interface for selling stocks"""
        print("\n" + "="*40)
        print("SELL STOCKS")
        print("="*40)
        
        if not self.portfolio.holdings:
            print("No stocks to sell!")
            return
        
        print("Your holdings:")
        for company, quantity in self.portfolio.holdings.items():
            print(f"{company}: {quantity} shares")
        
        company = input("\nEnter company name to sell: ").upper().strip()
        if company not in self.portfolio.holdings:
            print("You don't own this stock!")
            return
        
        stock = self.market.stocks[company]
        owned_quantity = self.portfolio.holdings[company]
        
        print(f"\n{stock.name} ({company})")
        print(f"Current Price: ${stock.current_price:.2f}")
        print(f"Owned Shares: {owned_quantity}")
        
        try:
            quantity = int(input("Enter quantity to sell: "))
            if quantity <= 0:
                print("Quantity must be positive!")
                return
            
            if quantity > owned_quantity:
                print(f"You only own {owned_quantity} shares!")
                return
            
            total_value = stock.current_price * quantity
            print(f"\nTotal Value: ${total_value:.2f}")
            
            confirm = input(f"Confirm sale? (y/n): ").lower().strip()
            if confirm == 'y':
                if self.portfolio.sell_stock(stock, quantity):
                    print(f"\nSuccessfully sold {quantity} shares of {company}!")
                    self.save_data()
                else:
                    print("Sale failed!")
            else:
                print("Sale cancelled.")
                
        except ValueError:
            print("Invalid quantity!")
    
    def view_transaction_history(self):
        """Display transaction history"""
        print("\n" + "="*80)
        print("TRANSACTION HISTORY")
        print("="*80)
        
        if not self.portfolio.transaction_history:
            print("No transactions yet.")
            return
        
        print(f"{'Date':<20} {'Type':<6} {'Company':<12} {'Quantity':<10} {'Price':<12} {'Total':<12}")
        print("-"*80)
        
        for tx in sorted(self.portfolio.transaction_history, key=lambda x: x['timestamp'], reverse=True):
            date_str = tx['timestamp'].strftime("%Y-%m-%d %H:%M:%S")
            print(f"{date_str:<20} {tx['type']:<6} {tx['symbol']:<12} {tx['quantity']:<10} ${tx['price']:<11.2f} ${tx['total']:<11.2f}")
    
    def performance_metrics(self):
        """Display performance metrics"""
        print("\n" + "="*60)
        print("PERFORMANCE METRICS")
        print("="*60)
        
        portfolio_value = self.portfolio.get_portfolio_value(self.market.stocks)
        total_return = self.portfolio.get_total_return(self.market.stocks)
        
        print(f"Initial Investment: ${self.portfolio.initial_cash:.2f}")
        print(f"Current Portfolio Value: ${portfolio_value:.2f}")
        print(f"Total Return: ${portfolio_value - self.portfolio.initial_cash:.2f}")
        print(f"Return Percentage: {total_return:+.2f}%")
        
        if self.portfolio.transaction_history:
            # Calculate some basic metrics
            buy_transactions = [tx for tx in self.portfolio.transaction_history if tx['type'] == 'BUY']
            sell_transactions = [tx for tx in self.portfolio.transaction_history if tx['type'] == 'SELL']
            
            print(f"\nTrading Activity:")
            print(f"Total Trades: {len(self.portfolio.transaction_history)}")
            print(f"Buy Orders: {len(buy_transactions)}")
            print(f"Sell Orders: {len(sell_transactions)}")
            
            if buy_transactions:
                first_trade = min(self.portfolio.transaction_history, key=lambda x: x['timestamp'])
                last_trade = max(self.portfolio.transaction_history, key=lambda x: x['timestamp'])
                trading_days = (last_trade['timestamp'] - first_trade['timestamp']).days + 1
                print(f"Trading Period: {trading_days} days")
    
    def run(self):
        """Main application loop"""
        print("="*60)
        print("WELCOME TO TRADING SIMULATOR")
        print("="*60)
        print("Starting market data updates...")
        
        self.market.start_market_updates()
        
        try:
            while True:
                print("\n" + "="*40)
                print("MAIN MENU")
                print("="*40)
                print("1. View Market Prices")
                print("2. View Portfolio")
                print("3. Buy Stocks")
                print("4. Sell Stocks")
                print("5. Transaction History")
                print("6. Performance Metrics")
                print("7. Save & Exit")
                
                choice = input("\nSelect option (1-7): ").strip()
                
                if choice == '1':
                    self.display_market_prices()
                elif choice == '2':
                    self.display_portfolio()
                elif choice == '3':
                    self.buy_stock_interface()
                elif choice == '4':
                    self.sell_stock_interface()
                elif choice == '5':
                    self.view_transaction_history()
                elif choice == '6':
                    self.performance_metrics()
                elif choice == '7':
                    self.save_data()
                    print("\nData saved. Thanks for trading!")
                    break
                else:
                    print("Invalid option!")
                
                input("\nPress Enter to continue...")
                
        except KeyboardInterrupt:
            print("\n\nShutting down...")
        finally:
            self.market.stop_market_updates()
            self.save_data()

if __name__ == "__main__":
    app = TradingApp()
    app.run()