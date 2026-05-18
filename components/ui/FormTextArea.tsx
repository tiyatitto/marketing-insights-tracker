import React from "react";

interface FormTextAreaProps {
    label: string;
    name: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function FormTextArea({ label, name, value = "", onChange }: FormTextAreaProps) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <textarea 
                name={name} 
                value={value} 
                onChange={onChange} 
                rows={3}
                className="w-full rounded-xl border border-slate-300 bg-white/50 px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm resize-y"
            ></textarea>
        </div>
    );
}
