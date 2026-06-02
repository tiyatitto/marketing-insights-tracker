"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, onSnapshot, getDocs, deleteDoc, setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthRole } from "../../hooks/useAuthRole";
import { 
    LayoutDashboard, 
    FileText, 
    Users, 
    ShieldCheck,
    DollarSign,
    CheckCircle2,
    Clock,
    Filter,
    TrendingUp
} from "lucide-react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Sidebar } from "../../components/layout/Sidebar";
import { StatCard } from "../../components/ui/StatCard";
import { SearchInput } from "../../components/ui/SearchInput";
import { AdminReportTable } from "../../components/admin/AdminReportTable";
import { AdminUserManagement } from "../../components/admin/AdminUserManagement";
import { ExportMenu } from "../../components/admin/ExportMenu";
import { AdminAnalytics } from "../../components/admin/AdminAnalytics";
import { AdminTargetTracking } from "../../components/admin/AdminTargetTracking";
import { ExpenseTracker } from "../../components/analytics/ExpenseTracker";


export default function AdminDashboard() {
    const router = useRouter();
    const [allReports, setAllReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, role, loading: authLoading } = useAuthRole();

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login");
            } else if (role !== "admin") {
                router.push("/staff");
            }
        }
    }, [user, role, authLoading, router]);

    useEffect(() => {
        if (authLoading || role !== "admin" || !user) return;

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
    }, [authLoading, role, user]);


    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const currentMonth = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
    const safeReports = allReports || [];
    const currentMonthExpense = safeReports.filter(r => r?.date?.includes(currentMonth.split(' ')[0])).reduce((acc, curr) => acc + parseFloat(curr?.cost || 0), 0);

    const stats = [
        { title: "Total Reports", value: safeReports.length.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
        { title: "Total Marketing Cost", value: `₹${safeReports.reduce((acc, curr) => acc + parseFloat(curr?.cost || 0), 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        { title: "Total Active Staff", value: new Set(safeReports.map(r => r?.staff)).size.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Current Month Expense", value: `₹${currentMonthExpense.toLocaleString()}`, icon: TrendingUp, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    const filteredReports = safeReports.filter(r => {
        const matchesSearch = r?.institution?.toLowerCase().includes(searchQuery.toLowerCase()) || r?.staff?.toLowerCase().includes(searchQuery.toLowerCase()) || r?.activity?.toLowerCase().includes(searchQuery.toLowerCase());
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
                        { id: "targets", label: "Targets", icon: TrendingUp, onClick: () => setActiveTab("targets") },
                        { id: "users", label: "User Management", icon: Users, onClick: () => setActiveTab("users") }
                    ]}
                />
            }
        >
            {authLoading ? (
                <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-slate-50">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent shadow-md"></div>
                    <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Admin Dashboard...</p>
                </div>
            ) : (!user || role !== "admin") ? null : isLoading ? (
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mx-auto max-w-7xl space-y-8"
            >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {activeTab === "users" ? "User Management" : activeTab === "reports" ? "Reports Hub" : activeTab === "expense" ? "Expense Tracker" : activeTab === "targets" ? "Target Tracking" : "Executive Dashboard"}
                        </h1>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                            {activeTab === "users"
                                ? "Create and manage staff accounts securely from the admin portal."
                                : activeTab === "reports"
                                ? "Monitor and manage marketing reports with filters and quick actions."
                                : activeTab === "expense"
                                ? "Track spending trends, marketeer expenses, and budget allocation."
                                : activeTab === "targets"
                                ? "Set and monitor monthly targets for unique institution and hospital visits."
                                : "Real-time overview of marketing activities and expenditures."}
                        </p>
                    </div>
                    {/* ExportMenu relocated to specific tabs */}
                </div>

                {/* KPI Cards removed as per request */}

                {activeTab === "dashboard" && (
                    <AdminAnalytics reports={safeReports} />
                )}



                {activeTab === "expense" && <ExpenseTracker reports={safeReports} isAdmin={true} />}
                
                {activeTab === "targets" && <AdminTargetTracking reports={safeReports} />}

                {activeTab === "users" && <AdminUserManagement />}
                
                {activeTab === "reports" && (
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                            <h2 className="text-lg font-bold text-slate-900">Reports Management</h2>
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                                <SearchInput placeholder="Search by staff, activity, or institution..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                                <ExportMenu 
                                    data={filteredReports} 
                                    filters={{ searchQuery: searchQuery || "None" }} 
                                    filename={`Reports_Export_${new Date().toISOString().split("T")[0]}`}
                                />
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
