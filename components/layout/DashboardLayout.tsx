import React, { useState } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";

interface DashboardLayoutProps {
    sidebarContent: React.ReactNode;
    children: React.ReactNode;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function DashboardLayout({ 
    sidebarContent, 
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
            <div className="flex flex-1 flex-col min-w-0 overflow-hidden relative">
                {/* Floating Mobile Toggle Button */}
                <button 
                    className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md text-slate-600 hover:text-indigo-600 lg:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-5 h-5" />
                </button>

                {/* Main Scrollable Area */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
