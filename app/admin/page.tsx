"use client";

import React, { useState } from "react";
import Link from "next/link";

// --- SVG Icons ---
const HomeIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const DocumentIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const ChartIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);
const UsersIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
const BellIcon = () => (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);
const SearchIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

export default function AdminDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    // Mock Data
    const stats = [
        { title: "Total Reports", value: "2,543", change: "+12.5%", isPositive: true },
        { title: "Total Expenditure", value: "$45,231", change: "+4.2%", isPositive: true },
        { title: "Monthly Engagements", value: "84.2K", change: "-1.5%", isPositive: false },
        { title: "Active Staff", value: "142", change: "+12", isPositive: true },
    ];

    const recentReports = [
        { id: "REP-101", institution: "Tech Solutions Inc.", contact: "john@techsol.com", cost: "$1,200", status: "Approved", date: "May 14, 2026" },
        { id: "REP-102", institution: "Global Markets", contact: "sarah@global.com", cost: "$3,450", status: "Pending", date: "May 13, 2026" },
        { id: "REP-103", institution: "Apex Systems", contact: "mike@apex.org", cost: "$850", status: "Rejected", date: "May 12, 2026" },
        { id: "REP-104", institution: "EduTech Corp", contact: "anna@edutech.edu", cost: "$2,100", status: "Approved", date: "May 11, 2026" },
        { id: "REP-105", institution: "HealthPlus", contact: "david@healthplus.com", cost: "$4,500", status: "Pending", date: "May 10, 2026" },
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <ChartIcon />
                        </div>
                        <span className="text-lg font-bold text-slate-900">Admin Portal</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between h-[calc(100vh-4rem)] pb-4">
                    <nav className="mt-6 px-4 space-y-1">
                        <Link href="#" className="flex items-center gap-3 rounded-lg bg-indigo-50 px-3 py-2.5 text-sm font-medium text-indigo-700 transition-colors">
                            <HomeIcon />
                            Dashboard
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <DocumentIcon />
                            Reports
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <UsersIcon />
                            Staff Management
                        </Link>
                        <Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <ChartIcon />
                            Analytics
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
                    <div className="flex items-center gap-4">
                        <button 
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden"
                            onClick={toggleSidebar}
                        >
                            <MenuIcon />
                        </button>
                        
                        {/* Search Bar Placeholder */}
                        <div className="hidden sm:flex items-center relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input 
                                type="text" 
                                className="block w-full rounded-full border-0 py-1.5 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-slate-50" 
                                placeholder="Search reports..." 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                            <BellIcon />
                            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        
                        {/* Profile Dropdown Placeholder */}
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2">
                            <div className="flex flex-col text-right hidden sm:block">
                                <span className="text-sm font-medium text-slate-900">Admin User</span>
                                <span className="text-xs text-slate-500">Administrator</span>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                                <UserIcon />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
                            <p className="text-sm text-slate-500 mt-1">Here's what's happening in your organization today.</p>
                        </div>

                        {/* Analytics Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                                    <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                                        <p className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Charts / Middle Section Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900">Expenditure Analytics</h2>
                                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View Report</button>
                                </div>
                                {/* Placeholder for Chart */}
                                <div className="h-64 w-full rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <div className="flex flex-col items-center text-slate-400">
                                        <ChartIcon />
                                        <span className="mt-2 text-sm">Chart Visualization Area</span>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full rounded-lg bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors text-left flex items-center justify-between">
                                        Generate Monthly Report
                                        <span>&rarr;</span>
                                    </button>
                                    <button className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left flex items-center justify-between">
                                        Review Pending Submissions
                                        <span>&rarr;</span>
                                    </button>
                                    <button className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left flex items-center justify-between">
                                        Manage Staff Accounts
                                        <span>&rarr;</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Reports Table */}
                        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Report ID</th>
                                            <th className="px-6 py-3 font-medium">Institution</th>
                                            <th className="px-6 py-3 font-medium">Contact</th>
                                            <th className="px-6 py-3 font-medium">Cost</th>
                                            <th className="px-6 py-3 font-medium">Date</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {recentReports.map((report) => (
                                            <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{report.id}</td>
                                                <td className="px-6 py-4 text-slate-600">{report.institution}</td>
                                                <td className="px-6 py-4 text-slate-600">{report.contact}</td>
                                                <td className="px-6 py-4 font-medium text-slate-700">{report.cost}</td>
                                                <td className="px-6 py-4 text-slate-500">{report.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                                        ${report.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                                          report.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                                                          'bg-red-100 text-red-700'}`}>
                                                        {report.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
