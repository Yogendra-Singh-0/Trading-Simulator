import React from 'react';
import { PieChart, DollarSign, TrendingUp } from 'lucide-react';

function PortfolioPanel({ portfolio, marketData }) {
    if (!portfolio) {
        return <div className="text-slate-400 p-8 text-center animate-pulse">Loading portfolio...</div>;
    }

    const { cash, initial_cash, portfolio_value, total_return, holdings } = portfolio;
    const isProfitable = total_return >= 0;

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                        <div className="bg-green-100 p-2 rounded-lg">
                             <DollarSign size={20} className="text-green-600" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Available Cash</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-4">${cash.toFixed(2)}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                             <PieChart size={20} className="text-blue-600" />
                        </div>
                        <h3 className="font-semibold text-slate-700">Portfolio Value</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mt-4">${portfolio_value.toFixed(2)}</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-slate-500 mb-2">
                        <div className={`p-2 rounded-lg ${isProfitable ? 'bg-green-100' : 'bg-red-100'}`}>
                           <TrendingUp size={20} className={isProfitable ? 'text-green-600' : 'text-red-600'} />
                        </div>
                        <h3 className="font-semibold text-slate-700">Total Return</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                        <p className={`text-3xl font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
                            {isProfitable ? '+' : ''}${(portfolio_value - initial_cash).toFixed(2)}
                        </p>
                        <span className={`font-medium ${isProfitable ? 'text-green-600/80' : 'text-red-600/80'}`}>
                            ({isProfitable ? '+' : ''}{total_return.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Holdings List */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-8">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">Current Holdings</h3>
                </div>

                {holdings.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No active holdings. Go to the Trade tab to buy some stocks.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Symbol</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Quantity</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">Current Price</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Total Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                {holdings.map((h) => (
                                    <tr key={h.symbol} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-bold text-slate-800">{h.symbol}</td>
                                        <td className="p-4 font-medium">{h.quantity} shares</td>
                                        <td className="p-4 font-medium">${h.current_price.toFixed(2)}</td>
                                        <td className="p-4 text-right font-bold text-slate-800">${h.total_value.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PortfolioPanel;
