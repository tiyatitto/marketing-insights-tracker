import React, { forwardRef } from "react";

export interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    requiredAttention?: boolean;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
    ({ label, requiredAttention = false, className, ...props }, ref) => {
        return (
            <div className="mb-4 relative">
                <div className="flex justify-between items-end mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">{label}</label>
                    {requiredAttention && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                            Pending Input
                        </span>
                    )}
                </div>
                <textarea 
                    ref={ref}
                    rows={3}
                    className={`w-full rounded-xl border px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 shadow-sm resize-y ${
                        requiredAttention 
                            ? "border-amber-400 bg-amber-50/30 focus:border-amber-500 focus:ring-amber-500/20 shadow-[0_0_15px_rgba(251,191,36,0.15)] ring-2 ring-amber-400/50" 
                            : "border-slate-300 bg-white/50 focus:border-indigo-500 focus:bg-white focus:ring-indigo-500/10"
                    } ${className || ""}`}
                    {...props}
                ></textarea>
            </div>
        );
    }
);

FormTextArea.displayName = "FormTextArea";
