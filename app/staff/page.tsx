"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
    FileText, 
    History, 
    PieChart,
    Building2,
    Calendar,
    DollarSign,
    PlusCircle
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { StatCard } from "../../components/ui/StatCard";
import { SearchInput } from "../../components/ui/SearchInput";
import { StaffReportTable } from "../../components/staff/StaffReportTable";
import { StaffReportForm } from "../../components/staff/StaffReportForm";

type ActivityType = 
    | "Meetings with Institutes"
    | "Follow up with Institutes"
    | "Campaigns Conducted"
    | "Participation in Conferences"
    | "Meetings with Hospitals"
    | "Follow up with Hospitals";

export default function StaffDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"dashboard" | "create">("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterActivity, setFilterActivity] = useState("All");
    
    // Dynamic Form State
    const [activityType, setActivityType] = useState<ActivityType>("Meetings with Institutes");
    const [formData, setFormData] = useState<any>({});
    
    // Mock Data State
    const [submissions, setSubmissions] = useState([
        { id: "REP-101", activity: "Meetings with Institutes", name: "Riverside High", cost: "500", date: "May 14, 2026", status: "Pending" },
        { id: "REP-102", activity: "Follow up with Hospitals", name: "City Care", cost: "120", date: "May 12, 2026", status: "Approved" },
        { id: "REP-103", activity: "Campaigns Conducted", name: "Tech University", cost: "850", date: "May 10, 2026", status: "Approved" },
        { id: "REP-104", activity: "Participation in Conferences", name: "Edu Summit 2026", cost: "1200", date: "May 08, 2026", status: "Rejected" },
    ]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActivityType(e.target.value as ActivityType);
        setFormData({});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newReport = {
            id: `REP-${Math.floor(Math.random() * 1000) + 200}`,
            activity: activityType,
            name: formData.institutionName || formData.hospitalName || formData.conferenceName || formData.institution || "N/A",
            cost: formData.costOfVisit || "0",
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            status: "Pending"
        };
        setSubmissions([newReport, ...submissions]);
        alert("Report submitted successfully!");
        setFormData({});
        setActiveTab("dashboard");
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Derived Stats
    const totalReports = submissions.length;
    const monthlyReports = submissions.filter(s => s.date.includes("May")).length;
    const totalCost = submissions.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);

    const filteredSubmissions = submissions.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterActivity === "All" || s.activity === filterActivity;
        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            sidebarContent={
                <Sidebar 
                    title="Staff Portal"
                    icon={Building2}
                    iconGradient="bg-gradient-to-tr from-indigo-600 to-blue-500"
                    activeTab={activeTab}
                    items={[
                        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, onClick: () => setActiveTab("dashboard") },
                        { id: "create", label: "Create Report", icon: PlusCircle, onClick: () => setActiveTab("create") },
                        { id: "history", label: "My Reports", icon: History, onClick: () => setActiveTab("dashboard") },
                        { id: "stats", label: "Statistics", icon: PieChart }
                    ]}
                />
            }
            headerContent={
                <Header 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchPlaceholder="Search everything..."
                    userName="Jane Staff"
                    userRole="Marketing Rep"
                />
            }
        >
            <AnimatePresence mode="wait">
                {activeTab === "dashboard" ? (
                    <motion.div 
                        key="dashboard"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto max-w-6xl space-y-6"
                    >
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Staff Overview</h1>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <StatCard title="Total Reports" value={totalReports} icon={FileText} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
                            <StatCard title="Monthly Reports" value={monthlyReports} icon={Calendar} colorClass="text-cyan-600" bgClass="bg-cyan-50" />
                            <StatCard title="Total Marketing Cost" value={`$${totalCost.toLocaleString()}`} icon={DollarSign} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <SearchInput placeholder="Search institution..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                    <select 
                                        value={filterActivity}
                                        onChange={(e) => setFilterActivity(e.target.value)}
                                        className="py-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                    >
                                        <option value="All">All Activities</option>
                                        <option value="Meetings with Institutes">Meetings with Institutes</option>
                                        <option value="Follow up with Institutes">Follow up with Institutes</option>
                                        <option value="Campaigns Conducted">Campaigns Conducted</option>
                                        <option value="Participation in Conferences">Participation in Conferences</option>
                                        <option value="Meetings with Hospitals">Meetings with Hospitals</option>
                                        <option value="Follow up with Hospitals">Follow up with Hospitals</option>
                                    </select>
                                </div>
                            </div>
                            <StaffReportTable submissions={filteredSubmissions} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="create"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto max-w-4xl"
                    >
                        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white">
                                <h2 className="text-2xl font-bold">Create New Report</h2>
                                <p className="mt-2 text-indigo-100">Select an activity type and fill out the details below.</p>
                            </div>
                            
                            <div className="p-8">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
                                        <label className="block text-sm font-bold text-slate-900 mb-2">Activity Type</label>
                                        <select 
                                            value={activityType}
                                            onChange={handleActivityChange}
                                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                                        >
                                            <option value="Meetings with Institutes">Meetings with Institutes</option>
                                            <option value="Follow up with Institutes">Follow up with Institutes</option>
                                            <option value="Campaigns Conducted">Campaigns Conducted</option>
                                            <option value="Participation in Conferences">Participation in Conferences</option>
                                            <option value="Meetings with Hospitals">Meetings with Hospitals</option>
                                            <option value="Follow up with Hospitals">Follow up with Hospitals</option>
                                        </select>
                                    </div>

                                    <div className="space-y-6">
                                        <StaffReportForm activityType={activityType} formData={formData} handleInputChange={handleInputChange} />
                                    </div>

                                    <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({})}
                                            className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                        >
                                            Reset Form
                                        </button>
                                        <button 
                                            type="button" 
                                            className="px-5 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all"
                                        >
                                            Save Draft
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 rounded-xl transition-all active:scale-[0.98]"
                                        >
                                            Submit Report
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
