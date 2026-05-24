"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, Calendar, Target, Filter, RotateCcw, Users } from "lucide-react";
import { StatCard } from "../ui/StatCard";
import { motion, AnimatePresence } from "framer-motion";

interface ExpenseTrackerProps {
    reports: any[];
    isAdmin?: boolean;
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function ExpenseTracker({ reports, isAdmin = false }: ExpenseTrackerProps) {
    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [filterMonth, setFilterMonth] = useState("All");
    const [filterActivity, setFilterActivity] = useState("All");
    const [filterMarketeer, setFilterMarketeer] = useState("All");

    // Extract unique values for dropdowns from original reports
    const months = useMemo(() => Array.from(new Set(reports.map(r => r.date.split(" ")[0]))), [reports]);
    const activities = useMemo(() => Array.from(new Set(reports.map(r => r.activity))), [reports]);
    const marketeers = useMemo(() => Array.from(new Set(reports.map(r => r.staff || r.creatorName))), [reports]);

    // Apply strict intersection filtering
    const filteredReports = useMemo(() => {
        return reports.filter(r => {
            let matches = true;

            // Date Range logic based on eventDate OR createdAt (fallback)
            const reportDateVal = new Date(r.eventDate || r.date).getTime();
            
            if (filterFromDate) {
                if (reportDateVal < new Date(filterFromDate).getTime()) matches = false;
            }
            if (filterToDate) {
                if (reportDateVal > new Date(filterToDate).getTime()) matches = false;
            }

            if (filterMonth !== "All" && !r.date.includes(filterMonth)) matches = false;
            if (filterActivity !== "All" && r.activity !== filterActivity) matches = false;
            if (isAdmin && filterMarketeer !== "All" && (r.staff || r.creatorName) !== filterMarketeer) matches = false;

            return matches;
        });
    }, [reports, filterFromDate, filterToDate, filterMonth, filterActivity, filterMarketeer, isAdmin]);

    const handleResetFilters = () => {
        setFilterFromDate("");
        setFilterToDate("");
        setFilterMonth("All");
        setFilterActivity("All");
        setFilterMarketeer("All");
    };

    // Derived Analytics
    const totalExpense = filteredReports.reduce((sum, r) => sum + parseFloat(r.cost || 0), 0);
    
    // Monthly data for charts
    const monthOrder = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthlyDataMap = filteredReports.reduce((acc, r) => {
        const parts = r.date.replace(",", "").split(" "); // e.g. ["May", "24", "2026"]
        const month = parts[0];
        const year = parseInt(parts[2] || new Date().getFullYear().toString());
        const key = `${month} ${year}`;
        if (!acc[key]) acc[key] = { month, year, amount: 0 };
        acc[key].amount += parseFloat(r.cost || 0);
        return acc;
    }, {} as Record<string, { month: string; year: number; amount: number }>);

    const rawMonthlyData = Object.values(monthlyDataMap).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

    let sortedMonthlyData: { name: string; amount: number }[] = [];
    if (rawMonthlyData.length > 0) {
        const start = rawMonthlyData[0];
        const end = rawMonthlyData[rawMonthlyData.length - 1];
        let currYear = start.year;
        let currMonthIdx = monthOrder.indexOf(start.month);
        
        while (currYear < end.year || (currYear === end.year && currMonthIdx <= monthOrder.indexOf(end.month))) {
            const mName = monthOrder[currMonthIdx];
            const key = `${mName} ${currYear}`;
            // Display year if spanning multiple years, otherwise just month
            const displayLabel = start.year !== end.year ? `${mName} ${currYear.toString().substring(2)}` : mName;
            sortedMonthlyData.push({
                name: displayLabel,
                amount: monthlyDataMap[key] ? monthlyDataMap[key].amount : 0
            });
            currMonthIdx++;
            if (currMonthIdx > 11) {
                currMonthIdx = 0;
                currYear++;
            }
        }
    }
    
    const highestMonth = rawMonthlyData.length ? rawMonthlyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : { month: "N/A", amount: 0 };
    const avgMonthly = rawMonthlyData.length ? (totalExpense / rawMonthlyData.length) : 0;

    // Activity data for pie chart
    const activityDataMap = filteredReports.reduce((acc, r) => {
        const act = r.activity;
        if (!acc[act]) acc[act] = 0;
        acc[act] += parseFloat(r.cost || 0);
        return acc;
    }, {} as Record<string, number>);
    const activityData = Object.keys(activityDataMap).map(k => ({ name: k, value: activityDataMap[k] }));

    // Marketeer data for bar chart (Admin only)
    const marketeerDataMap = filteredReports.reduce((acc, r) => {
        const staff = r.staff || r.creatorName;
        if (!acc[staff]) acc[staff] = 0;
        acc[staff] += parseFloat(r.cost || 0);
        return acc;
    }, {} as Record<string, number>);
    const marketeerData = Object.keys(marketeerDataMap).map(k => ({ name: k, amount: marketeerDataMap[k] })).sort((a, b) => b.amount - a.amount);
    const highestMarketeer = marketeerData.length ? marketeerData[0] : { name: "N/A", amount: 0 };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
                    <p className="text-indigo-600 font-semibold text-sm">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            {/* Sticky Advanced Filters */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-md flex flex-col xl:flex-row gap-4 items-center justify-between transition-all">
                <div className="flex items-center gap-2 text-slate-800 font-bold shrink-0">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Filter className="w-5 h-5" />
                    </div>
                    Smart Filters
                </div>
                
                <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</span>
                        <input type="date" value={filterFromDate} onChange={e => setFilterFromDate(e.target.value)} className="bg-transparent border-none text-sm outline-none text-slate-700 font-medium" />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</span>
                        <input type="date" value={filterToDate} onChange={e => setFilterToDate(e.target.value)} className="bg-transparent border-none text-sm outline-none text-slate-700 font-medium" />
                    </div>

                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="py-2.5 px-4 text-sm font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none hover:bg-slate-50 transition-colors cursor-pointer bg-white">
                        <option value="All">All Months</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>

                    <select value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} className="py-2.5 px-4 text-sm font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none hover:bg-slate-50 transition-colors cursor-pointer bg-white">
                        <option value="All">All Activities</option>
                        {activities.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    {isAdmin && (
                        <select value={filterMarketeer} onChange={(e) => setFilterMarketeer(e.target.value)} className="py-2.5 px-4 text-sm font-medium border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none hover:bg-slate-50 transition-colors cursor-pointer bg-white">
                            <option value="All">All Staff</option>
                            {marketeers.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    )}

                    <button 
                        onClick={handleResetFilters}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-200"
                        title="Reset Filters"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {filteredReports.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/60 backdrop-blur-sm border border-dashed border-slate-300 rounded-3xl p-12 text-center"
                >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No matching reports found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Try adjusting your date range or filter selections to view data.</p>
                    <button onClick={handleResetFilters} className="mt-6 px-6 py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition-colors">Clear Filters</button>
                </motion.div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={`${filteredReports.length}-${filterFromDate}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Numerical Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <StatCard title="Total Expense" value={`₹${totalExpense.toLocaleString()}`} icon={DollarSign} colorClass="text-emerald-600" bgClass="bg-gradient-to-br from-emerald-50 to-emerald-100/50" />
                            </motion.div>
                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <StatCard title="Avg Monthly Expense" value={`₹${avgMonthly.toLocaleString(undefined, {maximumFractionDigits: 0})}`} icon={TrendingUp} colorClass="text-indigo-600" bgClass="bg-gradient-to-br from-indigo-50 to-blue-50" />
                            </motion.div>
                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                <StatCard title="Highest Spend Month" value={highestMonth.month || "N/A"} icon={Calendar} colorClass="text-purple-600" bgClass="bg-gradient-to-br from-purple-50 to-fuchsia-50" />
                            </motion.div>
                            <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                {isAdmin ? (
                                    <StatCard title="Top Spender" value={highestMarketeer.name} icon={Target} colorClass="text-rose-600" bgClass="bg-gradient-to-br from-rose-50 to-orange-50" />
                                ) : (
                                    <StatCard title="Filtered Reports" value={filteredReports.length} icon={Target} colorClass="text-cyan-600" bgClass="bg-gradient-to-br from-cyan-50 to-blue-50" />
                                )}
                            </motion.div>
                        </div>

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-lg h-96 transition-all duration-300">
                                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" /> Monthly Expense Trend</h3>
                                <ResponsiveContainer width="100%" height="85%">
                                    <LineChart data={sortedMonthlyData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dx={-10} tickFormatter={(value) => `₹${value >= 1000 ? value/1000 + 'k' : value}`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={4} dot={{r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8, fill: '#4f46e5', strokeWidth: 0}} animationDuration={1500} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <motion.div whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/60 shadow-lg h-96 transition-all duration-300 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2"><PieChart className="w-4 h-4 text-emerald-500" /> Expense by Activity</h3>
                                <div className="flex-1 min-h-0 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={activityData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none" animationDuration={1500}>
                                                {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                                        <span className="text-xl font-black text-slate-800">₹{totalExpense >= 1000 ? (totalExpense/1000).toFixed(1) + 'k' : totalExpense}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-4 px-2">
                                    {activityData.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            <span className="text-[11px] font-semibold text-slate-600 truncate" title={entry.name}>{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>


                        </div>
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
}
