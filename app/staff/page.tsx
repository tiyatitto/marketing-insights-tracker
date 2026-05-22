"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, setDoc, addDoc, runTransaction, serverTimestamp } from "firebase/firestore";
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
import { ExpenseTracker } from "../../components/analytics/ExpenseTracker";

type ActivityType = 
    | "Meeting with Organization"
    | "Follow up with Institutes"
    | "Campaigns Conducted"
    | "Participation in Conferences"
    | "Follow up with Hospitals";

export default function StaffDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"dashboard" | "create">("dashboard");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterActivity, setFilterActivity] = useState("All");
    
    // Dynamic Form State
    const [activityType, setActivityType] = useState<ActivityType>("Meeting with Organization");
    const [formData, setFormData] = useState<any>({});
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [submissions, setSubmissions] = useState<any[]>([]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                
                const q = query(
                    collection(db, "reports"), 
                    where("creatorId", "==", user.uid)
                );
                
                const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
                    const fetchedReports = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        date: doc.data().createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) || "Just now",
                        eventDate: doc.data().formData?.eventDate || doc.data().formData?.meetingDate || doc.data().formData?.date || "",
                        observation: doc.data().formData?.observation || doc.data().formData?.remarks || doc.data().formData?.marketingObservation || doc.data().formData?.marketingConclusion || "",
                        timestamp: doc.data().createdAt?.toMillis() || Date.now()
                    })).sort((a, b) => b.timestamp - a.timestamp);
                    setSubmissions(fetchedReports);
                    setIsLoading(false);
                });

                return () => unsubscribeSnapshot();
            } else {
                window.location.href = "/login";
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActivityType(e.target.value as ActivityType);
        setFormData({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) return;
        
        // Validate that form has required data
        if (activityType === "Meeting with Organization" && !formData.meetingType) {
            alert("Please select a meeting type (Institution or Hospital)");
            return;
        }

        try {
            const counterRef = doc(db, "counters", "reports");
            const newReportId = await runTransaction(db, async (transaction) => {
                const counterDoc = await transaction.get(counterRef);
                let nextSeq = 1;
                if (counterDoc.exists()) {
                    nextSeq = counterDoc.data().seq + 1;
                }
                transaction.set(counterRef, { seq: nextSeq }, { merge: true });
                return `R${nextSeq.toString().padStart(3, '0')}`;
            });

            if (activityType === "Meeting with Organization" && formData.meetingType && !formData.organizationId) {
                const orgName = formData.institutionName || formData.hospitalName;
                if (orgName) {
                    await addDoc(collection(db, "organizations"), {
                        organizationType: formData.meetingType,
                        organizationName: orgName,
                        location: formData.location || "",
                        commonDetails: formData,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });
                }
            }

            await setDoc(doc(db, "reports", newReportId), {
                creatorId: currentUser.uid,
                creatorName: currentUser.displayName || currentUser.email?.split("@")[0] || "Staff User",
                creatorEmail: currentUser.email,
                activity: activityType,
                name: formData.institutionName || formData.hospitalName || formData.conferenceName || formData.institution || "N/A",
                cost: formData.costOfVisit || "0",
                status: "Pending",
                createdAt: serverTimestamp(),
                formData: formData
            });
            
            alert("Report submitted successfully!");
            setFormData({});
            setActiveTab("dashboard");
        } catch (error: any) {
            alert("Error submitting report: " + error.message);
        }
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
                        { id: "expense", label: "Expense Tracker", icon: DollarSign, onClick: () => setActiveTab("expense") },
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
                    userName={currentUser?.displayName || currentUser?.email?.split("@")[0] || "Staff User"}
                    userRole="Marketing Rep"
                />
            }
        >
            {isLoading ? (
                <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
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
                                        <option value="Meeting with Organization">Meeting with Organization</option>
                                        <option value="Follow up with Institutes">Follow up with Institutes</option>
                                        <option value="Campaigns Conducted">Campaigns Conducted</option>
                                        <option value="Participation in Conferences">Participation in Conferences</option>
                                        <option value="Follow up with Hospitals">Follow up with Hospitals</option>
                                    </select>
                                </div>
                            </div>
                            <StaffReportTable submissions={filteredSubmissions} />
                        </div>
                    </motion.div>
                ) : activeTab === "expense" ? (
                    <motion.div 
                        key="expense"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="mx-auto max-w-6xl space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Expense Tracker</h1>
                                <p className="text-sm text-slate-500 mt-1 font-medium">Monitor your personal marketing expenditures and budget utilization.</p>
                            </div>
                        </div>
                        <ExpenseTracker reports={submissions} isAdmin={false} />
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
                                            <option value="Meeting with Organization">Meeting with Organization</option>
                                            <option value="Follow up with Institutes">Follow up with Institutes</option>
                                            <option value="Campaigns Conducted">Campaigns Conducted</option>
                                            <option value="Participation in Conferences">Participation in Conferences</option>
                                            <option value="Follow up with Hospitals">Follow up with Hospitals</option>
                                        </select>
                                    </div>

                                    <div className="space-y-6">
                                        <StaffReportForm
                                            activityType={activityType}
                                            formData={formData}
                                            handleInputChange={handleInputChange}
                                            setFormData={setFormData}
                                        />
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
            )}
        </DashboardLayout>
    );
}
