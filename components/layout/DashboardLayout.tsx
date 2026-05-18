import React, { useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
    sidebarContent: React.ReactNode;
    headerContent: React.ReactNode;
    children: React.ReactNode;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function DashboardLayout({ 
    sidebarContent, 
    headerContent, 
    children, 
    isSidebarOpen, 
    toggleSidebar 
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 z-10">
                    <div className="flex items-center gap-4">
                        <button 
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 lg:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {headerContent}
                    </div>
                </header>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
