"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { OrganizationProfile } from "../../lib/schemas";
import { Building2, Mail, Phone, MapPin, Globe, FileText, User } from "lucide-react";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

interface ProfileDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: OrganizationProfile | null;
    onEditClick: (profile: OrganizationProfile) => void;
}

export function ProfileDetailsModal({ isOpen, onClose, profile, onEditClick }: ProfileDetailsModalProps) {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && profile?.id) {
            fetchRelatedReports();
        }
    }, [isOpen, profile]);

    const fetchRelatedReports = async () => {
        setIsLoading(true);
        try {
            const q1 = query(collection(db, "reports"), where("formData.organizationId", "==", profile?.id));
            const snap1 = await getDocs(q1);
            
            const fetchedReports = snap1.docs.map(d => ({ id: d.id, ...d.data() }))
                .sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
                
            setReports(fetchedReports);
        } catch (error) {
            console.error("Error fetching reports", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!profile) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex justify-between items-start">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                            <Building2 className="w-6 h-6 text-indigo-600" />
                            {profile.organizationName}
                        </DialogTitle>
                        <button 
                            onClick={() => onEditClick(profile)}
                            className="px-4 py-1.5 text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 border-b pb-2">Core Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">Type</p>
                                    <p className="text-slate-800 font-medium">{profile.organizationType}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">Location</p>
                                    <p className="text-slate-800 font-medium">{profile.location}</p>
                                </div>
                            </div>
                            {profile.website && (
                                <div className="flex items-start gap-3">
                                    <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold">Website</p>
                                        <a href={profile.website} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium hover:underline">{profile.website}</a>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">{profile.organizationType === "Institution" ? "Head of Institution" : "Medical Superintendent"}</p>
                                    <p className="text-slate-800 font-medium">{(profile.organizationType === "Institution" ? profile.headOfInstitution : profile.medicalSuperintendent) || <span className="text-amber-500 italic">Missing</span>}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">{profile.organizationType === "Institution" ? "Number of Students" : "Number of Beds"}</p>
                                    <p className="text-slate-800 font-medium">{(profile.organizationType === "Institution" ? profile.numberOfStudents : profile.numberOfBeds) || 0}</p>
                                </div>
                            </div>
                            {profile.organizationType === "Hospital" && profile.specializations && (
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold">Specializations</p>
                                        <p className="text-slate-800 font-medium">{profile.specializations}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900 border-b pb-2">Contact Details</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold">Contact Number</p>
                                    <p className="text-slate-800 font-medium">{profile.contactNumber}</p>
                                </div>
                            </div>
                            {profile.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <p className="text-slate-500 text-xs font-semibold">Email</p>
                                        <p className="text-slate-800 font-medium">{profile.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold text-slate-900 border-b pb-2">Related Reports ({reports.length})</h3>
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-16 bg-slate-100 rounded-xl"></div>
                                <div className="h-16 bg-slate-100 rounded-xl"></div>
                            </div>
                        ) : reports.length > 0 ? (
                            <div className="space-y-3">
                                {reports.map(r => (
                                    <div key={r.id} className="flex flex-col sm:flex-row justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-sm transition-all gap-3">
                                        <div>
                                            <p className="font-bold text-slate-800">{r.id}</p>
                                            <p className="text-sm font-medium text-slate-600">{r.activity}</p>
                                            <p className="text-xs text-slate-500 mt-1">Submitted by: {r.creatorName}</p>
                                        </div>
                                        <div className="sm:text-right flex flex-col justify-between">
                                            <span className="inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-full w-fit sm:ml-auto">
                                                {r.status || "Pending"}
                                            </span>
                                            <p className="text-sm font-bold text-emerald-600 mt-2">Cost: ₹{r.cost || 0}</p>
                                            <p className="text-xs text-slate-400 font-medium">{r.createdAt?.toDate().toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-medium">No reports linked to this profile yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
