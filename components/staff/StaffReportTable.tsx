"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";
import CountUp from "react-countup";
import { ReportDetailsModal } from "../ui/ReportDetailsModal";

export interface StaffReport {
    id: string;
    activity: string;
    name: string;
    cost: string;
    date: string;
    eventDate?: string;
    observation?: string;
}

interface StaffReportTableProps {
    submissions: StaffReport[];
}

export function StaffReportTable({ submissions }: StaffReportTableProps) {
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [selectedReport, setSelectedReport] = useState<StaffReport | null>(null);

    const getActivityColor = (activity: string) => {
        const act = activity.toLowerCase();
        if (act.includes("meeting")) return "bg-blue-100 text-blue-800 border-blue-200";
        if (act.includes("conference")) return "bg-purple-100 text-purple-800 border-purple-200";
        if (act.includes("campaign")) return "bg-green-100 text-green-800 border-green-200";
        if (act.includes("event") || act.includes("hospital")) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-slate-100 text-slate-800 border-slate-200";
    };

    return (
        <div className="flex flex-col w-full">
            {/* View Toggle */}
            <div className="flex justify-end px-6 py-4 bg-slate-50/50 border-b border-slate-100">
                <div className="bg-white border border-slate-200 rounded-lg p-1 flex gap-1 shadow-sm">
                    <button 
                        onClick={() => setViewMode("table")}
                        className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === "table" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        title="Table View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode("card")}
                        className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === "card" ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        title="Card View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === "table" ? (
                    <motion.div 
                        key="table"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="overflow-x-auto w-full"
                    >
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 whitespace-nowrap">Report ID</th>
                                    <th className="px-6 py-4">Activity / Organization</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Created Date</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-right">Event & Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {submissions.length > 0 ? submissions.map((report) => (
                                    <tr 
                                        key={report.id} 
                                        onClick={() => setSelectedReport(report)}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4 font-bold text-slate-900">{report.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{report.name}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{report.activity}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-600">{report.date}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-bold text-emerald-600">₹{parseFloat(report.cost).toLocaleString()}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{report.eventDate || "N/A"}</div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                            No reports found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-slate-50/30"
                    >
                        {submissions.length > 0 ? submissions.map((report) => (
                            <motion.div 
                                onClick={() => setSelectedReport(report)}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                key={report.id} 
                                className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col relative overflow-hidden cursor-pointer"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-50"></div>
                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg tracking-wider border border-indigo-100/50">
                                        {report.id}
                                    </span>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-600 text-lg">
                                            ₹<CountUp end={parseFloat(report.cost)} duration={2.5} separator="," />
                                        </div>
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">Event: {report.eventDate || "N/A"}</div>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{report.name}</h3>
                                <div className="mb-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getActivityColor(report.activity)}`}>
                                        {report.activity}
                                    </span>
                                </div>
                                
                                {report.observation && (
                                    <div className="bg-slate-50 rounded-xl p-3 mb-4 flex-1">
                                        <p className="text-xs text-slate-600 line-clamp-3 italic leading-relaxed">"{report.observation}"</p>
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-end">
                                    <span className="text-xs text-slate-400 font-medium">Logged: {report.date}</span>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No reports found matching your criteria.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
            />
        </div>
    );
}
