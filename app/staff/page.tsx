"use client";

import React, { useState } from "react";
import Link from "next/link";

// --- SVG Icons ---
const HomeIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const DocumentPlusIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const DocumentListIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const SettingsIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const MenuIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const LogOutIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const UserIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
const NotificationIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const BuildingIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
);

export default function StaffDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        institutionName: "",
        contact: "",
        cost: "",
        remarks: ""
    });

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for form submission logic
        console.log("Form submitted:", formData);
        alert("Report submitted successfully!");
        setFormData({ institutionName: "", contact: "", cost: "", remarks: "" });
    };

    // Mock Data
    const recentSubmissions = [
        { id: "SUB-001", institution: "Riverside High", contact: "Principal Smith", cost: "$500", date: "May 14, 2026", status: "Pending" },
        { id: "SUB-002", institution: "Tech Innovators", contact: "HR Manager", cost: "$1,200", date: "May 12, 2026", status: "Approved" },
        { id: "SUB-003", institution: "City Hospital", contact: "Dr. Adams", cost: "$350", date: "May 10, 2026", status: "Approved" },
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-16 items-center justify-center border-b border-slate-200 px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md">
                            <BuildingIcon />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Staff Portal</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-4rem)] pb-4">
                    <nav className="mt-6 px-4 space-y-1">
                        <Link href="#" className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-700 transition-colors">
                            <HomeIcon />
                            Dashboard
                        </Link>
                        <Link href="#submit-report" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <DocumentPlusIcon />
                            Submit Report
                        </Link>
                        <Link href="#my-submissions" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <DocumentListIcon />
                            My Submissions
                        </Link>
                    </nav>

                    <div className="px-4 mt-auto">
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <SettingsIcon />
                            Settings
                        </Link>
                        <Link href="/login" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1">
                            <LogOutIcon />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 z-10">
                    <button 
                        className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <MenuIcon />
                    </button>
                    
                    <div className="flex flex-1 justify-end items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                            <NotificationIcon />
                            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white"></span>
                        </button>
                        
                        {/* Profile Section */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
                            <div className="flex flex-col text-right hidden sm:block">
                                <span className="text-sm font-medium text-slate-900">Jane Staff</span>
                                <span className="text-xs text-slate-500">Marketing Representative</span>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 border border-blue-200">
                                <UserIcon />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-5xl space-y-8">
                        
                        {/* Welcome Section */}
                        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-lg text-white">
                            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Jane! 👋</h1>
                            <p className="mt-2 text-blue-100 max-w-2xl text-lg">
                                Ready to log your marketing activities? Submit your latest institutional visits and track your expenses below.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* Submission Form Section */}
                            <div className="lg:col-span-1" id="submit-report">
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                                        <DocumentPlusIcon />
                                        New Report
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="institutionName" className="block text-sm font-medium text-slate-700 mb-1">
                                                Institution Name
                                            </label>
                                            <input 
                                                type="text" 
                                                id="institutionName"
                                                name="institutionName"
                                                required
                                                value={formData.institutionName}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow" 
                                                placeholder="e.g. Lincoln High School" 
                                            />
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="contact" className="block text-sm font-medium text-slate-700 mb-1">
                                                Contact Person / Details
                                            </label>
                                            <input 
                                                type="text" 
                                                id="contact"
                                                name="contact"
                                                required
                                                value={formData.contact}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow" 
                                                placeholder="e.g. John Doe - 555-0192" 
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="cost" className="block text-sm font-medium text-slate-700 mb-1">
                                                Associated Cost ($)
                                            </label>
                                            <input 
                                                type="number" 
                                                id="cost"
                                                name="cost"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.cost}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow" 
                                                placeholder="0.00" 
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 mb-1">
                                                Remarks / Notes
                                            </label>
                                            <textarea 
                                                id="remarks"
                                                name="remarks"
                                                rows={3}
                                                value={formData.remarks}
                                                onChange={handleInputChange}
                                                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow resize-none" 
                                                placeholder="Add any relevant meeting notes here..." 
                                            ></textarea>
                                        </div>

                                        <button 
                                            type="submit"
                                            className="w-full mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
                                        >
                                            Submit Report
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Recent Submissions Section */}
                            <div className="lg:col-span-2" id="my-submissions">
                                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full">
                                    <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between bg-white">
                                        <h2 className="text-lg font-semibold text-slate-900">Recent Submissions</h2>
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View History</button>
                                    </div>
                                    
                                    {recentSubmissions.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                                <thead className="bg-slate-50/50 text-slate-500">
                                                    <tr>
                                                        <th className="px-6 py-3 font-medium">Institution</th>
                                                        <th className="px-6 py-3 font-medium">Cost</th>
                                                        <th className="px-6 py-3 font-medium">Date</th>
                                                        <th className="px-6 py-3 font-medium">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 bg-white">
                                                    {recentSubmissions.map((sub) => (
                                                        <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="font-medium text-slate-900">{sub.institution}</div>
                                                                <div className="text-slate-500 text-xs mt-0.5">{sub.contact}</div>
                                                            </td>
                                                            <td className="px-6 py-4 font-medium text-slate-700">{sub.cost}</td>
                                                            <td className="px-6 py-4 text-slate-500">{sub.date}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                                                                    ${sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                                                                    'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20'}`}>
                                                                    {sub.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                                            <DocumentListIcon />
                                            <p className="mt-2 text-sm">No submissions yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
