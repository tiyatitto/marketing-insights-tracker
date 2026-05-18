import React from "react";
import { CheckCircle2, Clock, XCircle, Eye, Trash2 } from "lucide-react";

interface AdminReport {
    id: string;
    staff: string;
    activity: string;
    institution: string;
    cost: string;
    date: string;
    status: string;
}

interface AdminReportTableProps {
    reports: AdminReport[];
}

export function AdminReportTable({ reports }: AdminReportTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                        <th className="px-6 py-4 whitespace-nowrap">Report ID</th>
                        <th className="px-6 py-4 whitespace-nowrap">Staff Name</th>
                        <th className="px-6 py-4">Activity / Institution</th>
                        <th className="px-6 py-4 whitespace-nowrap">Date & Cost</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {reports.length > 0 ? reports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-900">{report.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {report.staff.charAt(0)}
                                    </div>
                                    <span className="font-medium text-slate-700">{report.staff}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-slate-900">{report.institution}</div>
                                <div className="text-slate-500 text-xs mt-0.5">{report.activity}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-slate-900">{report.date}</div>
                                <div className="font-semibold text-slate-600 mt-0.5">${report.cost}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold
                                    ${report.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' : 
                                    report.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' : 
                                    'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'}`}>
                                    {report.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    {report.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                    {report.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                                    {report.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button title="View Report" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {report.status === 'Pending' && (
                                        <>
                                            <button title="Approve" className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button title="Reject" className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    <button title="Delete" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
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
