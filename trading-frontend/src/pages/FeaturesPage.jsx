import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Activity, Lock, Layers } from 'lucide-react';
import featuresHero from '../assets/features_hero_1776618844347.png';
import featuresShield from '../assets/features_shield_1776618863741.png';

const FeaturesPage = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const textVariant = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const floatVariant = {
    animate: {
      y: [0, -30, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 6, ease: "easeInOut", repeat: Infinity }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden selection:bg-green-200 selection:text-green-900">

      {/* Dynamic Nav */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-center z-50 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>
        <button
          onClick={() => navigate('/app')}
          className="px-6 py-2.5 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:shadow-green-500/30 transition-all active:scale-95"
        >
          Launch Simulator
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract animated blurs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-200/50 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-200/50 rounded-full mix-blend-multiply filter blur-[120px]"></div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center z-10"
        >
          <motion.div variants={textVariant} className="inline-block px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-bold tracking-widest text-sm mb-6 border border-slate-200 uppercase">
            Next-Gen Capabilities
          </motion.div>
          <motion.h1 variants={textVariant} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Experience<br />
            <span className="text-transparent bg-clip-text bg-linear-to-br from-green-400 via-emerald-600 to-cyan-600">
              Unrivaled Realism.
            </span>
          </motion.h1>
          <motion.p variants={textVariant} className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            TradeSim isn't just a toy. It's a high-fidelity sandbox powered by live data pipelines, matching real-world market movements milliseconds after they happen.
          </motion.p>
        </motion.div>

        <motion.div
          style={{ y: yParallax }}
          className="w-full max-w-6xl mx-auto mt-24 relative z-10"
        >
          <motion.img
            variants={floatVariant}
            animate="animate"
            src={featuresHero}
            alt="Data streams"
            className="w-full h-auto rounded-[2.5rem] shadow-2xl shadow-green-900/10"
          />
        </motion.div>
      </section>

      {/* Bento Grid Feature Section */}
      <section className="py-32 bg-white relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Everything you need to master trading.</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">From high-speed algorithmic mock testing to deep-dive portfolio analytics.</p>
          </motion.div>

          <div className="flex flex-col gap-12">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-50 p-8 md:p-12 rounded-4xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10 md:gap-16 overflow-hidden relative group"
            >
              <div className="flex-1 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 md:mb-8 text-blue-500">
                  <Activity size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-slate-800">Live Ticket Pipelines</h3>
                <p className="text-lg text-slate-500 leading-relaxed">Access second-by-second updates on the top 50 S&P equities and leading crypto tokens. Our latency is virtually zero, simulating a true direct-to-market broker connection.</p>
              </div>
              <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-50 rounded-full"></div>
                <div className="w-full bg-white rounded-3xl h-64 md:h-80 flex flex-col items-center justify-center shadow-lg border border-slate-200 relative z-10 group-hover:-translate-y-2 transition-all duration-500">
                  <Activity size={80} className="text-blue-400 mb-4 animate-pulse" />
                  <div className="w-3/4 h-6 bg-slate-100 rounded-full mb-3"></div>
                  <div className="w-1/2 h-6 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900 p-8 md:p-12 rounded-4xl border border-slate-800 shadow-xl flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16 overflow-hidden relative group text-white"
            >
              <div className="flex-1 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center mb-6 md:mb-8 text-green-400">
                  <Lock size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Zero-Risk Ecosystem</h3>
                <p className="text-lg text-slate-400 leading-relaxed">Make mistakes without losing your life savings. We provide you with a $100,000 mock balance to execute highly speculative strategies in a perfectly shielded environment.</p>
              </div>
              <div className="flex-1 w-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full scale-150"></div>
                <img
                  src={featuresShield}
                  alt="Shield"
                  className="w-full max-w-sm relative z-10 group-hover:scale-105 transition-all duration-700 drop-shadow-[0_0_50px_rgba(34,197,94,0.3)] filter brightness-110"
                />
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-50 p-8 md:p-12 rounded-4xl border border-emerald-100 flex flex-col md:flex-row items-center gap-10 md:gap-16 group"
            >
              <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 text-emerald-600">
                  <Layers size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-emerald-950">Deep Portfolio Analytics</h3>
                <p className="text-lg text-emerald-800">Track total returns, realized vs unrealized gains, and granular execution logs. Every trade is recorded down to the millisecond so you can audit your own performance.</p>
              </div>
              <div className="flex-1 w-full bg-white rounded-2xl shadow-xl p-6 border border-emerald-200/50 group-hover:shadow-emerald-200 transition-all duration-500 transform group-hover:-translate-y-2">
                <div className="space-y-4">
                  <div className="h-4 bg-emerald-100 rounded w-1/3"></div>
                  <div className="h-12 bg-emerald-50 rounded w-full flex items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-200 mr-4"></div>
                    <div className="w-1/2 h-4 bg-emerald-200 rounded"></div>
                  </div>
                  <div className="h-12 bg-emerald-50 rounded w-full flex items-center px-4">
                    <div className="w-8 h-8 rounded-full bg-slate-200 mr-4"></div>
                    <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 text-center bg-slate-900 text-white px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring" }}
          className="max-w-2xl mx-auto"
        >
          <Rocket size={64} className="mx-auto mb-8 text-green-400" />
          <h2 className="text-5xl font-bold mb-8">Stop reading. Start trading.</h2>
          <button
            onClick={() => navigate('/app')}
            className="px-12 py-6 bg-white text-slate-900 rounded-full font-bold text-2xl hover:bg-green-400 hover:text-white hover:scale-105 transition-all active:scale-95 shadow-xl shadow-green-500/20"
          >
            Enter the Simulator
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default FeaturesPage;
