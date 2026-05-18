import React from "react";
import { Search, Bell, User } from "lucide-react";

interface HeaderProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    searchPlaceholder: string;
    userName: string;
    userRole: string;
    userIcon?: React.ElementType;
}

export function Header({ searchQuery, setSearchQuery, searchPlaceholder, userName, userRole, userIcon: UserIcon = User }: HeaderProps) {
    return (
        <>
            <div className="hidden sm:flex items-center relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                </div>
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-64 rounded-full border-0 py-2 pl-10 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-slate-50 transition-all" 
                    placeholder={searchPlaceholder} 
                />
            </div>
            <div className="flex flex-1 sm:hidden"></div>
            
            <div className="flex items-center gap-4">
                <span className="hidden md:block text-sm font-medium text-slate-500">
                    {new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                
                <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </button>
                
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2 cursor-pointer">
                    <div className="flex flex-col text-right hidden sm:block">
                        <span className="text-sm font-bold text-slate-900">{userName}</span>
                        <span className="text-xs font-medium text-indigo-600">{userRole}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-sm">
                        <UserIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </>
    );
}
