import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export interface SidebarItem {
    id: string;
    icon: React.ElementType;
    label: string;
    href?: string;
    onClick?: () => void;
}

interface SidebarProps {
    title: string;
    icon: React.ElementType;
    items: SidebarItem[];
    activeTab?: string;
    bottomItems?: SidebarItem[];
    iconGradient: string;
}

export function Sidebar({ title, icon: Icon, items, activeTab, bottomItems = [], iconGradient }: SidebarProps) {
    return (
        <>
            <div className="flex h-16 items-center px-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md ${iconGradient}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">{title}</span>
                </div>
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-4rem)] pb-4">
                <nav className="mt-6 px-3 space-y-1">
                    {items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = activeTab === item.id;
                        const content = (
                            <>
                                <ItemIcon className="w-5 h-5" />
                                {item.label}
                            </>
                        );
                        const className = `w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                            isActive 
                                ? "bg-indigo-50 text-indigo-700" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`;

                        if (item.href) {
                            return (
                                <Link key={item.id} href={item.href} className={className}>
                                    {content}
                                </Link>
                            );
                        }
                        
                        return (
                            <button key={item.id} onClick={item.onClick} className={className}>
                                {content}
                            </button>
                        );
                    })}
                </nav>

                <div className="px-3 mt-auto">
                    {bottomItems.map((item) => {
                        const ItemIcon = item.icon;
                        return item.href ? (
                            <Link key={item.id} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <ItemIcon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        ) : (
                            <button key={item.id} onClick={item.onClick} className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <ItemIcon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                    <Link href="/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mt-1">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </div>
        </>
    );
}
