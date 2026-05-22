"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
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
import { AdminUserManagement } from "../../components/admin/AdminUserManagement";
import { ExportMenu } from "../../components/admin/ExportMenu";
import { ExpenseTracker } from "../../components/analytics/ExpenseTracker";

export default function AdminDashboard() {
    const [allReports, setAllReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                
                const q = query(collection(db, "reports"));
                
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const fetchedReports = snapshot.docs.map(doc => ({
                        id: doc.id,
                        staff: doc.data().creatorName || "Unknown Staff",
                        activity: doc.data().activity || "N/A",
                        institution: doc.data().name || "N/A",
                        cost: doc.data().cost || "0",
                        date: doc.data().createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "Just now",
                        eventDate: doc.data().formData?.eventDate || doc.data().formData?.meetingDate || doc.data().formData?.date || "",
                        observation: doc.data().formData?.observation || doc.data().formData?.remarks || doc.data().formData?.summary || doc.data().formData?.marketingObservation || doc.data().formData?.marketingConclusion || "",
                        status: doc.data().status || "Pending",
                        timestamp: doc.data().createdAt?.toMillis() || Date.now()
                    })).sort((a, b) => b.timestamp - a.timestamp);
                    
                    setAllReports(fetchedReports);
                    setIsLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                window.location.href = "/login";
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const stats = [
        { title: "Total Reports", value: allReports.length.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Pending Approval", value: allReports.filter(r => r.status === "Pending").length.toString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { title: "Approved Reports", value: allReports.filter(r => r.status === "Approved").length.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Marketing Cost", value: `$${(allReports.reduce((acc, curr) => acc + parseFloat(curr.cost || 0), 0) / 1000).toFixed(1)}K`, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Active Staff", value: new Set(allReports.map(r => r.staff)).size.toString(), icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" },
    ];

    const activityMap = allReports.reduce((acc, r) => {
        acc[r.activity] = (acc[r.activity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const activityData = Object.keys(activityMap).length > 0 
        ? Object.keys(activityMap).map(key => ({ name: key, value: activityMap[key] }))
        : [{ name: "No Data", value: 1 }];

    const monthlyMap = allReports.reduce((acc, r) => {
        const month = r.date.split(" ")[0];
        if (!acc[month]) acc[month] = { reports: 0, cost: 0 };
        acc[month].reports += 1;
        acc[month].cost += parseFloat(r.cost || 0);
        return acc;
    }, {} as Record<string, {reports: number, cost: number}>);
    const monthlyData = Object.keys(monthlyMap).length > 0
        ? Object.keys(monthlyMap).map(key => ({ name: key, reports: monthlyMap[key].reports, cost: monthlyMap[key].cost }))
        : [{ name: "No Data", reports: 0, cost: 0 }];

    const filteredReports = allReports.filter(r => {
        const matchesSearch = r.institution.toLowerCase().includes(searchQuery.toLowerCase()) || r.staff.toLowerCase().includes(searchQuery.toLowerCase()) || r.activity.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
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
                        { id: "expense", label: "Expense Tracker", icon: DollarSign, onClick: () => setActiveTab("expense") },
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
                    userName={currentUser?.displayName || currentUser?.email?.split("@")[0] || "Admin User"}
                    userRole="Administrator"
                    userIcon={ShieldCheck}
                />
            }
        >
            {isLoading ? (
                <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-7xl space-y-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {activeTab === "users" ? "User Management" : activeTab === "reports" ? "Reports Hub" : activeTab === "analytics" ? "Analytics Overview" : activeTab === "expense" ? "Expense Tracker" : "Executive Dashboard"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {activeTab === "users"
                                ? "Create and manage staff accounts securely from the admin portal."
                                : activeTab === "reports"
                                ? "Monitor and manage marketing reports with filters and quick actions."
                                : activeTab === "analytics"
                                ? "Explore campaign performance and marketing activity trends."
                                : activeTab === "expense"
                                ? "Track spending trends, marketeer expenses, and budget allocation."
                                : "Real-time overview of marketing activities and expenditures."}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ExportMenu 
                            data={filteredReports} 
                            filters={{ staff: "All", fromDate: "All", toDate: "All", activity: "All" }} 
                            filename={`Admin_Export_${new Date().toISOString().split("T")[0]}`}
                        />
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

                {(activeTab === "dashboard" || activeTab === "analytics") && <AdminCharts monthlyData={monthlyData} activityData={activityData} />}

                {activeTab === "expense" && <ExpenseTracker reports={allReports} isAdmin={true} />}

                {activeTab === "users" && <AdminUserManagement />}
                
                {activeTab === "reports" && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                            <h2 className="text-lg font-bold text-slate-900">Reports Management</h2>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <SearchInput placeholder="Search by staff, activity, or institution..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <AdminReportTable reports={filteredReports} />
                    </div>
                )}
            </motion.div>
                </AnimatePresence>
            )}
        </DashboardLayout>
    );
}
