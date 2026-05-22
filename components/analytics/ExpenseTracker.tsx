"use client";

import React, { useState, useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, Calendar, Target, Filter } from "lucide-react";
import { StatCard } from "../ui/StatCard";

interface ExpenseTrackerProps {
    reports: any[];
    isAdmin?: boolean;
}

const COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

export function ExpenseTracker({ reports, isAdmin = false }: ExpenseTrackerProps) {
    const [filterMonth, setFilterMonth] = useState("All");
    const [filterActivity, setFilterActivity] = useState("All");
    const [filterMarketeer, setFilterMarketeer] = useState("All");

    // Extract unique values for filters
    const months = useMemo(() => Array.from(new Set(reports.map(r => r.date.split(" ")[0]))), [reports]);
    const activities = useMemo(() => Array.from(new Set(reports.map(r => r.activity))), [reports]);
    const marketeers = useMemo(() => Array.from(new Set(reports.map(r => r.staff || r.creatorName))), [reports]);

    // Apply Filters
    const filteredReports = useMemo(() => {
        return reports.filter(r => {
            const matchMonth = filterMonth === "All" || r.date.includes(filterMonth);
            const matchActivity = filterActivity === "All" || r.activity === filterActivity;
            const matchMarketeer = filterMarketeer === "All" || (r.staff || r.creatorName) === filterMarketeer;
            return matchMonth && matchActivity && (isAdmin ? matchMarketeer : true);
        });
    }, [reports, filterMonth, filterActivity, filterMarketeer, isAdmin]);

    // Derived Analytics
    const totalExpense = filteredReports.reduce((sum, r) => sum + parseFloat(r.cost || 0), 0);
    
    // Monthly data for charts
    const monthlyDataMap = filteredReports.reduce((acc, r) => {
        const m = r.date.split(" ")[0];
        if (!acc[m]) acc[m] = 0;
        acc[m] += parseFloat(r.cost || 0);
        return acc;
    }, {} as Record<string, number>);
    const monthlyData = Object.keys(monthlyDataMap).map(k => ({ name: k, amount: monthlyDataMap[k] }));
    
    const highestMonth = monthlyData.length ? monthlyData.reduce((prev, current) => (prev.amount > current.amount) ? prev : current) : { name: "N/A", amount: 0 };
    const avgMonthly = monthlyData.length ? (totalExpense / monthlyData.length) : 0;

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

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                    <Filter className="w-5 h-5 text-indigo-600" />
                    Expense Filters
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="flex-1 sm:flex-none py-2 px-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="All">All Months</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)} className="flex-1 sm:flex-none py-2 px-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                        <option value="All">All Activities</option>
                        {activities.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {isAdmin && (
                        <select value={filterMarketeer} onChange={(e) => setFilterMarketeer(e.target.value)} className="flex-1 sm:flex-none py-2 px-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="All">All Staff</option>
                            {marketeers.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    )}
                </div>
            </div>

            {/* Numerical Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Expense" value={`$${totalExpense.toLocaleString()}`} icon={DollarSign} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
                <StatCard title="Avg Monthly Expense" value={`$${avgMonthly.toLocaleString(undefined, {maximumFractionDigits: 0})}`} icon={TrendingUp} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
                <StatCard title="Highest Spend Month" value={highestMonth.name} icon={Calendar} colorClass="text-rose-600" bgClass="bg-rose-50" />
                {isAdmin ? (
                    <StatCard title="Top Spender" value={highestMarketeer.name} icon={Target} colorClass="text-cyan-600" bgClass="bg-cyan-50" />
                ) : (
                    <StatCard title="Total Reports" value={filteredReports.length} icon={Target} colorClass="text-cyan-600" bgClass="bg-cyan-50" />
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Monthly Expense Trend</h3>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">No data available</div>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80">
                    <h3 className="text-sm font-bold text-slate-800 mb-4">Expense by Activity</h3>
                    {activityData.length > 0 ? (
                        <div className="h-full flex flex-col">
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={activityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                {activityData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-xs font-medium text-slate-600 truncate">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">No data available</div>
                    )}
                </div>

                {isAdmin && (
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-80 lg:col-span-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Marketeer Wise Spending</h3>
                        {marketeerData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marketeerData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                    <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-sm text-slate-400">No data available</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
