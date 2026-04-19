import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';
import heroImg from '../assets/trading_hero_image_1776617485415.png';
import chartImg from '../assets/crypto_chart_illustration_1776617502300.png';

const LandingPage = () => {
  const navigate = useNavigate();

  // Animation variants imitating ReactBits split text / fade in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-green-200">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50 max-w-7xl mx-auto left-0 right-0">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-bold text-2xl text-slate-800">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-green-400 to-green-600 flex items-center justify-center text-white">
            <BarChart3 size={20} />
          </div>
          TradeSim
        </motion.div>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/app')}
          className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95"
        >
          Launch App
        </motion.button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-70"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm w-fit shadow-xs">
              MOCK TRADING, REAL EXPERIENCE 🚀
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-slate-900">
              Master the Markets <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-emerald-600">
                Without the Risk.
              </span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Experience the adrenaline of real-time trading with zero financial danger.
              Our state-of-the-art simulator provides live market data, dynamic portfolio tracking, and instant execution. 
              Perfect for beginners learning the ropes and pros testing new strategies.
            </motion.p>
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <button 
                onClick={() => navigate('/app')}
                className="px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-full font-bold flex items-center gap-3 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95 drop-shadow-xl"
              >
                Start Trading Now <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/features')}
                className="px-8 py-4 bg-white text-slate-800 rounded-full font-bold border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all active:scale-95 flex items-center justify-center shadow-sm"
              >
                View Features
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            {/* Main Floating Image */}
            <motion.img 
              variants={floatVariants}
              animate="animate"
              src={heroImg} 
              alt="Trading Dashboard" 
              className="w-full h-auto drop-shadow-2xl rounded-3xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Built for precision and speed.</h2>
            <p className="text-lg text-slate-600">We've combined cutting-edge web technologies with real-time financial APIs to deliver an unparalleled simulated trading environment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <BarChart3 className="text-blue-500" size={32} />, title: "Real-time Analytics", desc: "Watch stocks and crypto move second by second with our live data integration." },
              { icon: <ShieldCheck className="text-green-500" size={32} />, title: "Zero Risk Factor", desc: "Test complex trading strategies with fake money before taking them live." },
              { icon: <Zap className="text-amber-500" size={32} />, title: "Instant Execution", desc: "Market orders execute instantly, mimicking high-frequency trading platforms." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section with 2nd Image */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Dark theme section for contrast */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-linear-to-bl from-green-900/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img src={chartImg} alt="Crypto Chart" className="w-full h-auto rounded-3xl shadow-2xl brightness-110" />
          </motion.div>
          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex flex-col gap-6"
          >
             <h2 className="text-4xl md:text-5xl font-bold leading-tight">
               Crypto & Equities. <br/>
               <span className="text-green-400">All in one place.</span>
             </h2>
             <p className="text-lg text-slate-300">
               Why limit yourself? Our robust backend connects to both traditional stock markets and volatile cryptocurrency exchanges. Diversify your mock portfolio and learn how different asset classes react to market events.
             </p>
             <ul className="space-y-4 mt-4">
                {['Live mock prices for top 50 equities', 'Real-time Crypto pairs', 'Comprehensive transaction history', 'Sleek, responsive UI'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
                    {item}
                  </li>
                ))}
             </ul>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 bg-slate-50 text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl font-bold mb-8 text-slate-900">Ready to start trading?</h2>
          <button 
            onClick={() => navigate('/app')}
            className="px-10 py-5 bg-green-500 text-white rounded-full font-bold text-xl hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/30 transition-all active:scale-95"
          >
            Enter Simulator
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
