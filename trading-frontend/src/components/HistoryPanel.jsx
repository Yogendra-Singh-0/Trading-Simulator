import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

function HistoryPanel({ history }) {
    if (!history || history.length === 0) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center mt-20 text-slate-500 space-y-4">
                <Clock size={48} className="text-slate-400" />
                <p className="text-xl font-medium text-slate-700">No transactions yet</p>
                <p className="text-sm">Start trading to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Execution Log</h3>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                    {history.length} Trades
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs">Date & Time</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs">Type</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs">Symbol</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs">Quantity</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs">Price</th>
                            <th className="p-4 font-semibold uppercase tracking-wider text-xs text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {history.map((tx, idx) => {
                            const date = new Date(tx.timestamp);
                            const isBuy = tx.type === 'BUY';

                            return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4 text-sm text-slate-500">
                                        {date.toLocaleDateString()} <span className="mx-1">&bull;</span> {date.toLocaleTimeString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit border ${
                                            isBuy ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                                            }`}>
                                            {isBuy ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">{tx.symbol}</td>
                                    <td className="p-4 font-medium">{tx.quantity}</td>
                                    <td className="p-4 font-medium">${tx.price.toFixed(2)}</td>
                                    <td className={`p-4 text-right font-bold ${isBuy ? 'text-slate-800' : 'text-slate-800'}`}>
                                        {isBuy ? '-' : '+'}${tx.total.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default HistoryPanel;
