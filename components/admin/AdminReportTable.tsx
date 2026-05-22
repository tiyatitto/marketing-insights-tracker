"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List } from "lucide-react";

export interface AdminReport {
    id: string;
    staff: string;
    activity: string;
    institution: string;
    cost: string;
    date: string;
    eventDate?: string;
    observation?: string;
}

interface AdminReportTableProps {
    reports: AdminReport[];
}

export function AdminReportTable({ reports }: AdminReportTableProps) {
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

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
                                    <th className="px-6 py-4 whitespace-nowrap">Staff Name</th>
                                    <th className="px-6 py-4">Activity / Organization</th>
                                    <th className="px-6 py-4 whitespace-nowrap">Created Date</th>
                                    <th className="px-6 py-4 whitespace-nowrap text-right">Event & Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {reports.length > 0 ? reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-slate-900">{report.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {report.staff.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-700">{report.staff}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{report.institution}</div>
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
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
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
                        {reports.length > 0 ? reports.map((report) => (
                            <motion.div 
                                whileHover={{ y: -4, scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                key={report.id} 
                                className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg tracking-wider border border-indigo-100/50">
                                        {report.id}
                                    </span>
                                    <div className="text-right">
                                        <div className="font-bold text-emerald-600 text-lg">₹{parseFloat(report.cost).toLocaleString()}</div>
                                        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">Event: {report.eventDate || "N/A"}</div>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{report.institution}</h3>
                                <p className="text-slate-500 text-sm font-medium mb-4">{report.activity}</p>
                                
                                {report.observation && (
                                    <div className="bg-slate-50 rounded-xl p-3 mb-4 flex-1">
                                        <p className="text-xs text-slate-600 line-clamp-3 italic leading-relaxed">"{report.observation}"</p>
                                    </div>
                                )}
                                
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                                            {report.staff.charAt(0)}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{report.staff}</span>
                                    </div>
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
        </div>
    );
}
