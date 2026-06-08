"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot, doc, setDoc } from "firebase/firestore";
import { Target, Hospital, Building2 } from "lucide-react";

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
        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (snapshot.empty) {
                // Auto-seed predefined targets
                const year = new Date().getFullYear();
                const defaultTargets = [
                    { id: `Institution_${year}_01`, type: "Institution", month: `${year}-01`, target: 20 },
                    { id: `Institution_${year}_02`, type: "Institution", month: `${year}-02`, target: 20 },
                    { id: `Institution_${year}_03`, type: "Institution", month: `${year}-03`, target: 25 },
                    { id: `Institution_${year}_04`, type: "Institution", month: `${year}-04`, target: 25 },
                    { id: `Institution_${year}_05`, type: "Institution", month: `${year}-05`, target: 30 },
                    { id: `Institution_${year}_06`, type: "Institution", month: `${year}-06`, target: 30 },
                    { id: `Hospital_${year}_01`, type: "Hospital", month: `${year}-01`, target: 15 },
                    { id: `Hospital_${year}_02`, type: "Hospital", month: `${year}-02`, target: 15 },
                    { id: `Hospital_${year}_03`, type: "Hospital", month: `${year}-03`, target: 20 },
                    { id: `Hospital_${year}_04`, type: "Hospital", month: `${year}-04`, target: 20 },
                    { id: `Hospital_${year}_05`, type: "Hospital", month: `${year}-05`, target: 25 },
                    { id: `Hospital_${year}_06`, type: "Hospital", month: `${year}-06`, target: 25 },
                ];
                
                for (const t of defaultTargets) {
                    await setDoc(doc(db, "monthlyTargets", t.id), t);
                }
            } else {
                const fetched = snapshot.docs.map(d => ({
                    id: d.id,
                    ...d.data()
                })) as MonthlyTarget[];
                setTargets(fetched);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<number>(0);

    const handleSaveTarget = async (docId: string, monthStr: string, targetValue: number) => {
        try {
            await setDoc(doc(db, "monthlyTargets", docId), {
                type: activeTab,
                month: monthStr,
                target: targetValue
            }, { merge: true });
            setEditingCell(null);
        } catch (error) {
            console.error("Error saving target:", error);
            alert("Failed to save target.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, docId: string, monthStr: string) => {
        if (e.key === "Enter") {
            handleSaveTarget(docId, monthStr, editValue);
        } else if (e.key === "Escape") {
            setEditingCell(null);
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

        // Total visits instead of unique organizations
        return filtered.length;
    };

    const filteredTargets = targets.filter(t => t.type === activeTab);

    // Generate strict 7-month rolling window (current - 3 months to current + 3 months)
    const monthsList: string[] = [];
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    for (let i = 0; i < 7; i++) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        monthsList.push(`${year}-${month}`);
        d.setMonth(d.getMonth() + 1);
    }

    const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Target vs Achievement</h2>
                        <p className="text-xs text-slate-500 font-medium">Track total visits against monthly goals</p>
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
                                <th className="pb-3 px-4 w-48">Target</th>
                                <th className="pb-3 px-4">No. of Visits Achieved</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {monthsList.map(monthStr => {
                                const docId = `${activeTab}_${monthStr}`;
                                const targetObj = filteredTargets.find(t => t.id === docId);
                                const targetValue = targetObj?.target || 0;
                                const achieved = getAchievedCount(activeTab, monthStr);
                                
                                const [year, monthNum] = monthStr.split("-");
                                const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
                                const isCurrentMonth = monthStr === currentMonthStr;

                                return (
                                    <tr 
                                        key={monthStr} 
                                        className={`transition-colors ${isCurrentMonth ? "bg-indigo-50/50 border-l-4 border-indigo-500" : "hover:bg-slate-50/50 border-l-4 border-transparent"}`}
                                    >
                                        <td className="py-4 px-4 font-semibold text-slate-800">
                                            <div className="flex items-center gap-2">
                                                {monthName}
                                                {isCurrentMonth && (
                                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-md">
                                                        Current Month
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td 
                                            className="py-4 px-4 cursor-pointer group"
                                            onDoubleClick={() => {
                                                setEditingCell(docId);
                                                setEditValue(targetValue);
                                            }}
                                            title="Double click to edit"
                                        >
                                            {editingCell === docId ? (
                                                <input 
                                                    type="number" 
                                                    value={editValue}
                                                    onChange={e => setEditValue(Number(e.target.value))}
                                                    onBlur={() => handleSaveTarget(docId, monthStr, editValue)}
                                                    onKeyDown={(e) => handleKeyDown(e, docId, monthStr)}
                                                    className="w-24 p-1.5 border border-indigo-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800 bg-white shadow-sm"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-700">{targetValue}</span>
                                                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-indigo-500 font-semibold uppercase tracking-wider transition-opacity">
                                                        Double-click to edit
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 font-bold text-slate-700">
                                            {achieved}
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
