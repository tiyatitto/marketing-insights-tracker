import React from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

interface Report {
    id: string;
    activity: string;
    name: string;
    cost: string;
    date: string;
    status: string;
}

interface StaffReportTableProps {
    submissions: Report[];
}

export function StaffReportTable({ submissions }: StaffReportTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                        <th className="px-6 py-4">Activity Type</th>
                        <th className="px-6 py-4">Institution / Hospital</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Cost ($)</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {submissions.length > 0 ? submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{sub.activity}</td>
                            <td className="px-6 py-4">{sub.name}</td>
                            <td className="px-6 py-4">{sub.date}</td>
                            <td className="px-6 py-4 font-medium">${sub.cost}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
                                    ${sub.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 
                                    sub.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 
                                    'bg-rose-50 text-rose-700'}`}>
                                    {sub.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {sub.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                    {sub.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                                    {sub.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</button>
                                <button className="text-rose-600 hover:text-rose-900 font-medium text-sm ml-3">Delete</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                No reports found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
