import React from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function SearchInput({ placeholder, value, onChange, className = "w-full sm:w-64" }: SearchInputProps) {
    return (
        <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`${className} pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all`}
            />
        </div>
    );
}
