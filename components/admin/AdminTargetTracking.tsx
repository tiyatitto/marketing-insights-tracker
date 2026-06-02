"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc } from "firebase/firestore";
import { Target, TrendingUp, Hospital, Building2 } from "lucide-react";
import { motion } from "framer-motion";

interface MonthlyTarget {
    id: string; // e.g., "Institution_2026_06"
    type: "Institution" | "Hospital";
    month: string; // "YYYY-MM" format
    target: number;
}

export function AdminTargetTracking({ reports }: { reports: any[] }) {
    const [targets, setTargets] = useState<MonthlyTarget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"Institution" | "Hospital">("Institution");

    useEffect(() => {
        const q = query(collection(db, "monthlyTargets"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data()
            })) as MonthlyTarget[];
            setTargets(fetched);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    });

    const handleSaveTarget = async (id: string, type: "Institution" | "Hospital", month: string, targetValue: number) => {
        try {
            await setDoc(doc(db, "monthlyTargets", id), {
                type,
                month,
                target: targetValue
            }, { merge: true });
            setIsEditing(null);
        } catch (error) {
            console.error("Error saving target:", error);
            alert("Failed to save target.");
        }
    };

    const getAchievedCount = (type: "Institution" | "Hospital", monthYYYYMM: string) => {
        // Month filter: report date includes YYYY-MM
        const [yearStr, monthStr] = monthYYYYMM.split("-");
        const monthNum = parseInt(monthStr, 10);
        const monthName = new Date(parseInt(yearStr), monthNum - 1).toLocaleString('default', { month: 'short' });
        
        const filtered = reports.filter(r => {
            // Check if it's the requested type
            const isCorrectType = type === "Institution" 
                ? (r.activity?.includes("Institution") || r.activity?.includes("Institute") || (r.formData && r.formData.meetingType === "Institution"))
                : (r.activity?.includes("Hospital") || (r.formData && r.formData.meetingType === "Hospital"));
            
            // Check if it's in the requested month
            // Report date format: "Jun 2, 2026"
            const matchesMonth = r.date?.includes(monthName) && r.date?.includes(yearStr);
            const matchesEventDate = r.eventDate?.startsWith(monthYYYYMM); // eventDate format: "YYYY-MM-DD"
            
            return isCorrectType && (matchesMonth || matchesEventDate);
        });

        // Unique organizations only
        const uniqueOrgs = new Set();
        filtered.forEach(r => {
            const orgId = r.formData?.organizationId || r.institution;
            if (orgId) uniqueOrgs.add(orgId);
        });

        return uniqueOrgs.size;
    };

    // Generate last 6 months + next 6 months for selection
    const generateMonths = () => {
        const months = [];
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        for (let i = 0; i < 12; i++) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            months.push(`${year}-${month}`);
            d.setMonth(d.getMonth() + 1);
        }
        return months;
    };

    const monthsList = generateMonths();

    // Data for currently active tab
    const filteredTargets = targets.filter(t => t.type === activeTab);
    
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Target vs Achievement</h2>
                        <p className="text-xs text-slate-500 font-medium">Track unique visits against monthly goals</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("Institution")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "Institution" ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Building2 className="w-4 h-4" />
                        Institutions
                    </button>
                    <button
                        onClick={() => setActiveTab("Hospital")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === "Hospital" ? "bg-white text-emerald-700 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                    >
                        <Hospital className="w-4 h-4" />
                        Hospitals
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                <th className="pb-3 px-4">Month / Year</th>
                                <th className="pb-3 px-4">Target (Unique Visits)</th>
                                <th className="pb-3 px-4">Achieved</th>
                                <th className="pb-3 px-4">Achievement %</th>
                                <th className="pb-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {monthsList.map(monthStr => {
                                const docId = `${activeTab}_${monthStr}`;
                                const targetObj = filteredTargets.find(t => t.id === docId);
                                const targetValue = targetObj?.target || 0;
                                const achieved = getAchievedCount(activeTab, monthStr);
                                const percentage = targetValue > 0 ? Math.round((achieved / targetValue) * 100) : 0;
                                
                                const [year, monthNum] = monthStr.split("-");
                                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

                                return (
                                    <tr key={monthStr} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-4 font-semibold text-slate-800">{monthName}</td>
                                        <td className="py-4 px-4">
                                            {isEditing === docId ? (
                                                <input 
                                                    type="number" 
                                                    value={editValue}
                                                    onChange={e => setEditValue(Number(e.target.value))}
                                                    className="w-24 p-1.5 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="font-bold text-slate-700">{targetValue}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-700">{achieved}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <span className={`font-bold ${percentage >= 100 ? "text-emerald-600" : percentage >= 50 ? "text-amber-500" : "text-rose-500"}`}>
                                                    {percentage}%
                                                </span>
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                                                        className={`h-full rounded-full ${percentage >= 100 ? "bg-emerald-500" : percentage >= 50 ? "bg-amber-400" : "bg-rose-500"}`}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {isEditing === docId ? (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => setIsEditing(null)}
                                                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSaveTarget(docId, activeTab, monthStr, editValue)}
                                                        className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md shadow-sm"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => {
                                                        setIsEditing(docId);
                                                        setEditValue(targetValue);
                                                    }}
                                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-3 py-1.5 rounded-md"
                                                >
                                                    Set Target
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
