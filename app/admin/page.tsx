"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    ShieldCheck,
    DollarSign,
    CheckCircle2,
    Clock,
    BarChart3,
    Filter
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { StatCard } from "../../components/ui/StatCard";
import { SearchInput } from "../../components/ui/SearchInput";
import { AdminReportTable } from "../../components/admin/AdminReportTable";
import { AdminCharts } from "../../components/admin/AdminCharts";

// Mock Data for Charts
const monthlyData = [
    { name: 'Jan', reports: 40, cost: 2400 },
    { name: 'Feb', reports: 30, cost: 1398 },
    { name: 'Mar', reports: 20, cost: 9800 },
    { name: 'Apr', reports: 27, cost: 3908 },
    { name: 'May', reports: 18, cost: 4800 },
    { name: 'Jun', reports: 23, cost: 3800 },
];

const activityData = [
    { name: 'Institute Meetings', value: 400 },
    { name: 'Hospital Meetings', value: 300 },
    { name: 'Campaigns', value: 300 },
    { name: 'Conferences', value: 200 },
];

export default function AdminDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [activeTab, setActiveTab] = useState("dashboard");

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const stats = [
        { title: "Total Reports", value: "1,284", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Pending Approval", value: "42", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Approved Reports", value: "1,190", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Marketing Cost", value: "$45.2K", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active Staff", value: "24", icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" },
    ];

    const allReports = [
        { id: "REP-2001", staff: "Jane Staff", activity: "Meetings with Institutes", institution: "Tech Solutions", cost: "1200", date: "May 14, 2026", status: "Pending" },
        { id: "REP-2002", staff: "John Doe", activity: "Campaigns Conducted", institution: "Global University", cost: "3450", date: "May 13, 2026", status: "Approved" },
        { id: "REP-2003", staff: "Sarah Smith", activity: "Participation in Conferences", institution: "Edu Summit 2026", cost: "850", date: "May 12, 2026", status: "Rejected" },
        { id: "REP-2004", staff: "Jane Staff", activity: "Meetings with Hospitals", institution: "City Care General", cost: "2100", date: "May 11, 2026", status: "Approved" },
        { id: "REP-2005", staff: "Mike Ross", activity: "Follow up with Institutes", institution: "Riverside High", cost: "450", date: "May 10, 2026", status: "Pending" },
    ];

    const filteredReports = allReports.filter(r => {
        const matchesSearch = r.institution.toLowerCase().includes(searchQuery.toLowerCase()) || r.staff.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "All" || r.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <DashboardLayout
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            sidebarContent={
                <Sidebar 
                    title="Admin Portal"
                    icon={ShieldCheck}
                    iconGradient="bg-gradient-to-tr from-slate-800 to-indigo-900"
                    activeTab={activeTab}
                    items={[
                        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, onClick: () => setActiveTab("dashboard") },
                        { id: "reports", label: "Reports", icon: FileText, onClick: () => setActiveTab("reports") },
                        { id: "analytics", label: "Analytics", icon: BarChart3, onClick: () => setActiveTab("analytics") },
                        { id: "users", label: "User Management", icon: Users, onClick: () => setActiveTab("users") }
                    ]}
                />
            }
            headerContent={
                <Header 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    searchPlaceholder="Global Search (Reports, Staff)..."
                    userName="Admin User"
                    userRole="Administrator"
                    userIcon={ShieldCheck}
                />
            }
        >
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-7xl space-y-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Real-time overview of marketing activities and expenditures.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                            Export Data
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors">
                            Generate Report
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {stats.map((stat, idx) => (
                        <StatCard 
                            key={idx}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            colorClass={stat.color}
                            bgClass={stat.bg}
                        />
                    ))}
                </div>

                <AdminCharts monthlyData={monthlyData} activityData={activityData} />

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-200 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                        <h2 className="text-lg font-bold text-slate-900">Reports Management</h2>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <SearchInput placeholder="Search by staff or institution..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-slate-400" />
                                <select 
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="py-2 pl-2 pr-8 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-slate-700"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending Approval</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <AdminReportTable reports={filteredReports} />
                </div>
            </motion.div>
        </DashboardLayout>
    );
}
