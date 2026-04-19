import React, { useState, useEffect } from 'react';
import api from '../api';
import MarketPanel from '../components/MarketPanel';
import PortfolioPanel from '../components/PortfolioPanel';
import TradingPanel from '../components/TradingPanel';
import HistoryPanel from '../components/HistoryPanel';
import { LineChart, Wallet, ArrowRightLeft, History, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('market');
  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [marketRes, portRes, histRes] = await Promise.all([
        api.get('/market'),
        api.get('/portfolio'),
        api.get('/history')
      ]);
      setMarketData(marketRes.data.stocks);
      setPortfolio(portRes.data);
      setHistory(histRes.data.history);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type, symbol, quantity) => {
    try {
      await api.post(`/${type}`, { symbol, quantity });
      fetchData();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.detail || "Transaction failed"
      };
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Navigation - Light Theme */}
      <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shadow-xs z-20 shrink-0">
        <div className="p-4 md:p-6 border-b border-slate-200 hidden md:flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-bold bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2 tracking-tight">
            <LineChart className="text-green-500" /> TradeSim
          </h1>
        </div>
        <nav className="flex md:flex-col p-2 md:p-4 overflow-x-auto md:overflow-y-auto space-x-2 md:space-x-0 md:space-y-2 shrink-0 hide-scrollbar">
          <TabButton
            active={activeTab === 'market'}
            onClick={() => setActiveTab('market')}
            icon={<LineChart size={20} />}
            label="Market"
          />
          <TabButton
            active={activeTab === 'portfolio'}
            onClick={() => setActiveTab('portfolio')}
            icon={<Wallet size={20} />}
            label="Portfolio"
          />
          <TabButton
            active={activeTab === 'trade'}
            onClick={() => setActiveTab('trade')}
            icon={<ArrowRightLeft size={20} />}
            label="Trade"
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<History size={20} />}
            label="History"
          />
        </nav>
        
        {portfolio && (
          <div className="p-4 md:p-5 border-t border-slate-200 bg-slate-50/50 hidden md:block">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Balance</p>
            <p className="text-2xl font-bold text-slate-800">${portfolio.portfolio_value.toFixed(2)}</p>
          </div>
        )}

        <div className="p-2 md:p-4 border-l md:border-l-0 md:border-t border-slate-200 hidden md:flex items-center shrink-0">
           <button 
             onClick={() => navigate('/')}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
           >
             <LogOut size={20} />
             <span className="font-medium">Exit App</span>
           </button>
        </div>
      </div>

      {/* Main Content - Light Theme */}
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Subtle background gradient to make app feel premium */}
        <div className="absolute inset-0 bg-linear-to-br from-green-50/50 to-slate-50/50 pointer-events-none -z-10"></div>
        
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center px-8 shrink-0 z-10 shadow-xs">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'market' && <MarketPanel data={marketData} />}
            {activeTab === 'portfolio' && <PortfolioPanel portfolio={portfolio} marketData={marketData} />}
            {activeTab === 'trade' && <TradingPanel marketData={marketData} portfolio={portfolio} onTrade={handleTrade} />}
            {activeTab === 'history' && <HistoryPanel history={history} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3.5 rounded-full md:rounded-xl transition-all whitespace-nowrap duration-200 font-medium ${
        active
          ? 'bg-green-50 text-green-600 shadow-sm border border-green-100'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border-transparent border'
      }`}
    >
      {icon}
      <span className="text-sm md:text-base">{label}</span>
    </button>
  );
}

export default Dashboard;
