"use client";

import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { OrganizationProfileModal } from "./OrganizationProfileModal";
import { ProfileDetailsModal } from "./ProfileDetailsModal";
import { OrganizationProfile } from "../../lib/schemas";
import { Building2, Search, PlusCircle, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProfileManagement({ currentUser }: { currentUser: any }) {
    const [profiles, setProfiles] = useState<OrganizationProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [detailsModalProfile, setDetailsModalProfile] = useState<OrganizationProfile | null>(null);
    const [editModalProfile, setEditModalProfile] = useState<OrganizationProfile | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<"All" | "Institution" | "Hospital">("All");

    useEffect(() => {
        const q = query(collection(db, "organizations"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as OrganizationProfile[];
            setProfiles(fetched);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredProfiles = profiles.filter(p => {
        const matchesType = filterType === "All" || p.organizationType === filterType;
        const matchesSearch = p.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organization Profiles</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage and reuse Institution and Hospital profiles across your reports.</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                    <PlusCircle className="w-5 h-5" />
                    Create New Profile
                </button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search profiles..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto bg-slate-50 p-1 rounded-xl border border-slate-200">
                    {["All", "Institution", "Hospital"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${filterType === type ? "bg-white text-indigo-700 shadow-sm border border-slate-200/50" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : filteredProfiles.length === 0 ? (
                <div className="bg-white/60 backdrop-blur-sm border border-dashed border-slate-300 rounded-3xl p-12 text-center">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800 mb-2">No organization profiles created yet</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">Create an organization profile to auto-fill details during report creation.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredProfiles.map((p) => (
                            <motion.div 
                                key={p.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => setDetailsModalProfile(p)}
                                className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 shrink-0">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        {(!p.location || !p.contactNumber || (p.organizationType === "Institution" && !p.headOfInstitution) || (p.organizationType === "Hospital" && !p.medicalSuperintendent)) ? (
                                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Incomplete Profile</span>
                                        ) : (
                                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Complete Profile</span>
                                        )}
                                    </div>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${p.organizationType === "Institution" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                                        {p.organizationType}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">{p.organizationName}</h3>
                                <p className="text-sm font-medium text-slate-500 line-clamp-1 mb-4">{p.location || <span className="text-amber-500 italic">Missing Location</span>}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-xs text-slate-600 font-medium">
                                        <span className="w-20 text-slate-400">Contact:</span>
                                        <span className={p.contactNumber ? "" : "text-amber-500 italic"}>{p.contactNumber || "Missing Contact"}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-600 font-medium">
                                        <span className="w-20 text-slate-400">{p.organizationType === "Institution" ? "Head:" : "Supt:"}</span>
                                        {p.organizationType === "Institution" ? (
                                            <span className={p.headOfInstitution ? "" : "text-amber-500 italic"}>{p.headOfInstitution || "Missing Head"}</span>
                                        ) : (
                                            <span className={p.medicalSuperintendent ? "" : "text-amber-500 italic"}>{p.medicalSuperintendent || "Missing Med. Supt."}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-600 font-medium">
                                        <span className="w-20 text-slate-400">{p.organizationType === "Institution" ? "Students:" : "Beds:"}</span>
                                        <span>{p.organizationType === "Institution" ? (p.numberOfStudents || 0) : (p.numberOfBeds || 0)}</span>
                                    </div>
                                </div>
                                
                                <div className="border-t border-slate-100 pt-3 flex justify-end items-center">
                                    <span className="text-xs font-semibold text-indigo-600 group-hover:underline">View Details &rarr;</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <OrganizationProfileModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                currentUser={currentUser}
            />

            {editModalProfile && (
                <OrganizationProfileModal 
                    isOpen={!!editModalProfile} 
                    onClose={() => setEditModalProfile(null)} 
                    initialData={editModalProfile}
                    currentUser={currentUser}
                />
            )}

            <ProfileDetailsModal 
                isOpen={!!detailsModalProfile}
                onClose={() => setDetailsModalProfile(null)}
                profile={detailsModalProfile}
                onEditClick={(profile) => {
                    setDetailsModalProfile(null);
                    setTimeout(() => setEditModalProfile(profile), 150);
                }}
            />
        </motion.div>
    );
}
