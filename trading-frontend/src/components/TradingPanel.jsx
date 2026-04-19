import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function TradingPanel({ marketData, portfolio, onTrade }) {
    const [selectedStock, setSelectedStock] = useState('');
    const [quantity, setQuantity] = useState('');
    const [action, setAction] = useState('buy'); // buy or sell
    const [message, setMessage] = useState(null);

    const stock = marketData.find(s => s.symbol === selectedStock);
    const holding = portfolio?.holdings.find(h => h.symbol === selectedStock);

    const handleTrade = async (e) => {
        e.preventDefault();
        if (!stock || !quantity || Number(quantity) <= 0) return;

        setMessage(null);
        const result = await onTrade(action, selectedStock, Number(quantity));

        if (result.success) {
            setMessage({ type: 'success', text: `Successfully ${action === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${selectedStock}` });
            setQuantity('');
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Execution Terminal</h2>

                {/* Toggle Buy/Sell */}
                <div className="flex bg-slate-100 rounded-xl p-1 mb-8 border border-slate-200/60">
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${action === 'buy' ? 'bg-green-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        onClick={() => { setAction('buy'); setMessage(null); }}
                    >
                        Buy
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${action === 'sell' ? 'bg-red-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        onClick={() => { setAction('sell'); setMessage(null); }}
                    >
                        Sell
                    </button>
                </div>

                <form onSubmit={handleTrade} className="space-y-6">
                    {/* Select Stock */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Asset</label>
                        <select
                            className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none shadow-xs"
                            value={selectedStock}
                            onChange={(e) => { setSelectedStock(e.target.value); setMessage(null); }}
                            required
                        >
                            <option value="" disabled>Choose a stock...</option>
                            {marketData.map(s => (
                                <option key={s.symbol} value={s.symbol}>
                                    {s.symbol} - {s.name} (${s.current_price.toFixed(2)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none shadow-xs"
                            placeholder="e.g. 10"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    {/* Trade Info context */}
                    {stock && (
                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm space-y-3 text-slate-600">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Current Price</span>
                                <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-xs border border-slate-100">${stock.current_price.toFixed(2)}</span>
                            </div>
                            {action === 'buy' && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Available Cash</span>
                                        <span className="font-bold text-slate-800">${portfolio?.cash.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-800 pt-3 border-t border-slate-200 mt-2">
                                        <span className="font-bold">Estimated Cost</span>
                                        <span className="font-bold text-lg text-blue-600">${(stock.current_price * (quantity || 0)).toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {action === 'sell' && (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Owned Shares</span>
                                        <span className="font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-xs border border-slate-100">{holding ? holding.quantity : 0}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-800 pt-3 border-t border-slate-200 mt-2">
                                        <span className="font-bold">Estimated Value</span>
                                        <span className="font-bold text-lg text-blue-600">${(stock.current_price * (quantity || 0)).toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Messages */}
                    {message && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-xs ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
                            <span className="font-semibold text-sm">{message.text}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={!stock || !quantity}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${!stock || !quantity
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                : action === 'buy'
                                    ? 'bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white shadow-green-500/20'
                                    : 'bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white shadow-red-500/20'
                            }`}
                    >
                        Execute {action.toUpperCase()} Order
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default TradingPanel;
