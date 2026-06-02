"use client";

import React, { useMemo } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from "recharts";
import { Users, PieChart as PieChartIcon, Activity, TrendingUp, Building2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface AdminAnalyticsProps {
    reports: any[];
}

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
const MONTH_ORDER = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function AdminAnalytics({ reports }: AdminAnalyticsProps) {
    const safeReports = reports || [];

    // 1. Staff Performance Data (Bar Chart)
    const staffData = useMemo(() => {
        const map = safeReports.reduce((acc, r) => {
            const staff = r.staff || r.creatorName;
            if (!acc[staff]) acc[staff] = { name: staff, reports: 0 };
            acc[staff].reports += 1;
            return acc;
        }, {} as Record<string, { name: string; reports: number }>);
        return Object.values(map).sort((a: any, b: any) => b.reports - a.reports).slice(0, 10);
    }, [safeReports]);

    // 2. Activity Distribution Data (Pie Chart)
    const activityData = useMemo(() => {
        const map = safeReports.reduce((acc, r) => {
            const act = r.activity;
            if (!acc[act]) acc[act] = 0;
            acc[act] += 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.keys(map).map(k => ({ name: k, value: map[k] }));
    }, [safeReports]);

    // 3. Monthly Report Volume (Area Chart)
    const monthlyVolumeData = useMemo(() => {
        const map = safeReports.reduce((acc, r) => {
            const parts = r.date.replace(",", "").split(" ");
            const month = parts[0];
            const year = parseInt(parts[2] || new Date().getFullYear().toString());
            const key = `${month} ${year}`;
            if (!acc[key]) acc[key] = { month, year, volume: 0 };
            acc[key].volume += 1;
            return acc;
        }, {} as Record<string, { month: string; year: number; volume: number }>);

        const raw = Object.values(map).sort((a: any, b: any) => {
            if (a.year !== b.year) return a.year - b.year;
            return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
        });

        return raw.map((item: any) => ({
            name: `${item.month} ${item.year.toString().substring(2)}`,
            volume: item.volume
        }));
    }, [safeReports]);

    // 4. Monthly Expense Trend (Line Chart)
    const monthlyExpenseData = useMemo(() => {
        const map = safeReports.reduce((acc, r) => {
            const parts = r.date.replace(",", "").split(" ");
            const month = parts[0];
            const year = parseInt(parts[2] || new Date().getFullYear().toString());
            const key = `${month} ${year}`;
            if (!acc[key]) acc[key] = { month, year, amount: 0 };
            acc[key].amount += parseFloat(r.cost || 0);
            return acc;
        }, {} as Record<string, { month: string; year: number; amount: number }>);

        const raw = Object.values(map).sort((a: any, b: any) => {
            if (a.year !== b.year) return a.year - b.year;
            return MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month);
        });

        return raw.map((item: any) => ({
            name: `${item.month} ${item.year.toString().substring(2)}`,
            amount: item.amount
        }));
    }, [safeReports]);

    // 5. Top Performing Organizations (Bar Chart)
    const topOrgsData = useMemo(() => {
        const map = safeReports.reduce((acc, r) => {
            const org = r.institution || r.name || "N/A";
            if (!acc[org]) acc[org] = { name: org, reports: 0 };
            acc[org].reports += 1;
            return acc;
        }, {} as Record<string, { name: string; reports: number }>);
        return Object.values(map).sort((a: any, b: any) => b.reports - a.reports).slice(0, 10);
    }, [safeReports]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-3 rounded-xl shadow-xl">
                    <p className="font-bold text-slate-800 text-sm mb-1">{label}</p>
                    {payload.map((p: any, idx: number) => (
                        <p key={idx} className="text-sm font-semibold" style={{ color: p.color }}>
                            {p.name === 'amount' ? `₹${p.value.toLocaleString()}` : `${p.value} ${p.name}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 mt-6">
            {/* Swiper Graph Carousel */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-200/60 shadow-xl overflow-hidden relative"
            >
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={true}
                    className="w-full h-[450px] !pb-10"
                >
                    {/* Slide 1: Reports Generated Trend */}
                    <SwiperSlide>
                        <div className="h-full w-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" /> Reports Generated Trend
                            </h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyVolumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dx={-10} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="volume" name="reports" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorVolume)" activeDot={{r: 8, fill: '#6d28d9', strokeWidth: 0}} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 2: Monthly Expense Trend */}
                    <SwiperSlide>
                        <div className="h-full w-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-500" /> Monthly Expense Trend
                            </h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyExpenseData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dx={-10} tickFormatter={(val) => `₹${val/1000}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line type="monotone" dataKey="amount" name="amount" stroke="#10b981" strokeWidth={4} dot={{r: 5, fill: '#10b981', strokeWidth: 3, stroke: '#fff'}} activeDot={{r: 8, fill: '#059669', strokeWidth: 0}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 3: Staff Performance */}
                    <SwiperSlide>
                        <div className="h-full w-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" /> Staff Performance Analysis (Top 10)
                            </h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={staffData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 12, fontWeight: 600}} width={100} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="reports" name="reports" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 4: Top Performing Organizations */}
                    <SwiperSlide>
                        <div className="h-full w-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-indigo-600" /> Top Performing Organizations (Visits)
                            </h3>
                            <div className="flex-1 min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={topOrgsData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 11, fontWeight: 600}} width={150} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="reports" name="visits" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </SwiperSlide>

                    {/* Slide 5: Activity Distribution */}
                    <SwiperSlide>
                        <div className="h-full w-full flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-rose-500" /> Activity Distribution
                            </h3>
                            <div className="flex-1 min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={activityData} cx="50%" cy="50%" innerRadius={90} outerRadius={130} paddingAngle={5} dataKey="value" stroke="none">
                                            {activityData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-slate-800">{safeReports.length}</span>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </motion.div>

            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-500" /> Recent Reports
                    </h3>
                    <div className="space-y-4">
                        {safeReports.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="flex justify-between items-center group">
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{r.institution || r.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{r.activity}</p>
                                </div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md ml-2 shrink-0">{r.date}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-500" /> Top Organizations
                    </h3>
                    <div className="space-y-4">
                        {topOrgsData.slice(0, 5).map((org: any) => (
                            <div key={org.name} className="flex justify-between items-center group">
                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-600 transition-colors">{org.name}</p>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-2 shrink-0">{org.reports} visits</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <h3 className="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" /> Recent Staff Activity
                    </h3>
                    <div className="space-y-4">
                        {safeReports.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                                    {(r.staff || r.creatorName || "U").charAt(0).toUpperCase()}
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{r.staff || r.creatorName}</p>
                                    <p className="text-xs text-slate-500 truncate">Submitted report for {r.institution || r.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
