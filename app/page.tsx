"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background gradients */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50 to-slate-50 z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[10%] right-[-5%] w-[30%] h-[40%] bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-12 sm:pb-24">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-6 mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <BarChart2 className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Marketing Insights</span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mt-20 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              Version 2.0 is live
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Track marketing activity <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                with absolute precision.
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Empower your staff to log visits and expenses seamlessly, while giving administrators real-time analytics to drive strategic decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-white text-lg font-bold shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-lg font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
          id="features"
        >
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Reporting</h3>
            <p className="text-slate-600 leading-relaxed">
              Intelligent forms adapt instantly based on activity types, ensuring you capture exactly the data you need without clutter.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Transform raw activity data into actionable insights instantly. Track costs, monitor team performance, and visualize trends.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Access</h3>
            <p className="text-slate-600 leading-relaxed">
              Role-based authentication ensures staff and administrators see only what they need, backed by robust Firebase security.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
