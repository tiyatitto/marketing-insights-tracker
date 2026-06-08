import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { motion } from "framer-motion";
import { FileText, Building2, MapPin, Phone, Mail, Calendar, User, DollarSign, Paperclip, ClipboardList } from "lucide-react";

interface ReportDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: any | null;
}

export function ReportDetailsModal({ isOpen, onClose, report }: ReportDetailsModalProps) {
    if (!report) return null;

    const getActivityColor = (activity: string) => {
        const act = activity?.toLowerCase() || "";
        if (act.includes("meeting")) return "bg-blue-100 text-blue-800 border-blue-200";
        if (act.includes("conference")) return "bg-purple-100 text-purple-800 border-purple-200";
        if (act.includes("campaign")) return "bg-green-100 text-green-800 border-green-200";
        if (act.includes("event") || act.includes("hospital")) return "bg-orange-100 text-orange-800 border-orange-200";
        return "bg-slate-100 text-slate-800 border-slate-200";
    };

    const formData = report.formData || {};
    
    const orgName = formData.institutionName || formData.hospitalName || formData.institution || formData.conferenceName || report.name || "N/A";
    const orgType = formData.meetingType || formData.organizationType || (report.activity?.includes("Hospital") ? "Hospital" : "Institution");

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:rounded-2xl">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white rounded-t-2xl flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-lg tracking-wider backdrop-blur-sm border border-white/30">
                                {report.id}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getActivityColor(report.activity)}`}>
                                {report.activity}
                            </span>
                        </div>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <FileText className="w-6 h-6 opacity-80" /> Report Details
                        </DialogTitle>
                    </div>
                </div>

                <div className="p-6 space-y-8 bg-slate-50">
                    
                    {/* Organization Details */}
                    <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}}>
                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                            <Building2 className="w-4 h-4" /> Organization Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Name</p>
                                <p className="text-sm font-bold text-slate-900">{orgName}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500">Type</p>
                                <p className="text-sm font-medium text-slate-800">{orgType}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Location</p>
                                    <p className="text-sm font-medium text-slate-800">{formData.location || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Contact Number</p>
                                    <p className="text-sm font-medium text-slate-800">{formData.contactNumber || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:col-span-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Email</p>
                                    <p className="text-sm font-medium text-slate-800">{formData.email || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Activity Details */}
                    <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}}>
                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                            <ClipboardList className="w-4 h-4" /> Activity Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Event Date</p>
                                    <p className="text-sm font-bold text-slate-900">{report.eventDate || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500">Staff Name</p>
                                    <p className="text-sm font-medium text-slate-800">{report.creatorName || "N/A"}</p>
                                </div>
                            </div>
                            
                            <div className="sm:col-span-2 space-y-4 mt-2">
                                {formData.marketingObservation && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Marketing Observation / Remarks</p>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
                                            "{formData.marketingObservation}"
                                        </div>
                                    </div>
                                )}
                                {formData.feedback && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Feedback from Client</p>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
                                            "{formData.feedback}"
                                        </div>
                                    </div>
                                )}
                                {formData.marketingConclusion && (
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Marketing Conclusion</p>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
                                            "{formData.marketingConclusion}"
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>

                    {/* Expense & Meta Details */}
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.3}} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                                <DollarSign className="w-4 h-4" /> Expense Details
                            </h3>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <span className="text-sm font-semibold text-slate-600">Total Cost</span>
                                <span className="text-xl font-bold text-emerald-600">₹{parseFloat(report.cost || "0").toLocaleString()}</span>
                            </div>
                        </section>
                        
                        <section>
                            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                                <Calendar className="w-4 h-4" /> Timeline
                            </h3>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 block">Created Date</span>
                                    <span className="text-sm font-medium text-slate-800">{report.date}</span>
                                </div>
                            </div>
                        </section>
                    </motion.div>

                    {/* Attachments Placeholder */}
                    <motion.section initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.4}}>
                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-2 mb-4 border-b border-indigo-100 pb-2">
                            <Paperclip className="w-4 h-4" /> Attachments
                        </h3>
                        <div className="bg-white p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                                <Paperclip className="w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-600">No attachments available</p>
                            <p className="text-xs text-slate-400 mt-1">Attachments feature is not yet enabled for this report.</p>
                        </div>
                    </motion.section>

                </div>
            </DialogContent>
        </Dialog>
    );
}
