import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

function MarketPanel({ data }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((stock) => {
                const isUp = stock.history.length >= 2
                    ? stock.current_price >= stock.history[stock.history.length - 2]
                    : true;

                // Calculate recent change %
                let changePct = 0;
                let changeVal = 0;
                if (stock.history.length >= 2) {
                    const prev = stock.history[stock.history.length - 2];
                    changeVal = stock.current_price - prev;
                    changePct = (changeVal / prev) * 100;
                }

                return (
                    <div key={stock.symbol} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg transition-all shadow-sm group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-green-600 transition-colors">{stock.symbol}</h3>
                                <p className="text-sm font-medium text-slate-500">{stock.name}</p>
                            </div>
                            <div className={`p-2 rounded-xl border ${isUp ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                {isUp ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-slate-900 tracking-tight">${stock.current_price.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-slate-100">
                            <span className={`font-bold px-2 py-1 rounded bg-slate-50 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                {isUp ? '+' : ''}{changeVal.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
                            </span>
                            <span className="text-slate-400 font-medium text-xs uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                );
            })}

            {data.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-500">
                    <div className="animate-pulse w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="font-semibold text-lg">Connecting to markets...</p>
                </div>
            )}
        </div>
    );
}

export default MarketPanel;
