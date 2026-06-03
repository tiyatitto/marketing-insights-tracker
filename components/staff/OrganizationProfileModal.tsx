"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, PlusCircle, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { OrganizationProfileSchema, OrganizationProfile } from "../../lib/schemas";
import { db } from "../../lib/firebase";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from "firebase/firestore";

interface OrganizationProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: OrganizationProfile | null;
    currentUser: any;
}

export function OrganizationProfileModal({ isOpen, onClose, initialData, currentUser }: OrganizationProfileModalProps) {
    const [orgType, setOrgType] = useState<"Institution" | "Hospital">(
        initialData?.organizationType || "Institution"
    );
    const [isSaving, setIsSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const isEditMode = !!initialData;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<OrganizationProfile>({
        resolver: zodResolver(OrganizationProfileSchema) as any,
        defaultValues: initialData || { organizationType: "Institution" }
    });

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setOrgType(initialData.organizationType as "Institution" | "Hospital");
                reset({
                    id: initialData.id,
                    organizationName: initialData.organizationName || "",
                    organizationType: initialData.organizationType || "Institution",
                    location: initialData.location || "",
                    contactNumber: initialData.contactNumber || "",
                    email: initialData.email || "",
                    website: initialData.website || "",
                    notes: initialData.notes || "",
                    // Institution
                    headOfInstitution: (initialData as any).headOfInstitution || "",
                    numberOfStudents: (initialData as any).numberOfStudents || "",
                    // Hospital
                    medicalSuperintendent: (initialData as any).medicalSuperintendent || "",
                    specializations: (initialData as any).specializations || "",
                    numberOfBeds: (initialData as any).numberOfBeds || ""
                } as any);
            } else {
                setOrgType("Institution");
                reset({ organizationType: "Institution" });
            }
        }
    }, [isOpen, initialData, reset]);

    const handleTypeSwitch = (type: "Institution" | "Hospital") => {
        if (isEditMode) return; // Cannot switch type in edit mode
        setOrgType(type);
        setValue("organizationType", type);
    };

    const onSubmit = async (data: OrganizationProfile) => {
        setIsSaving(true);
        try {
            if (!isEditMode) {
                // Prevent duplicates (case-insensitive)
                const q = query(collection(db, "organizations"));
                const snapshot = await getDocs(q);
                const isDuplicate = snapshot.docs.some(
                    d => d.data().organizationName?.toLowerCase().trim() === data.organizationName.toLowerCase().trim()
                );

                if (isDuplicate) {
                    alert("An organization with this exact name already exists.");
                    setIsSaving(false);
                    return;
                }

                // Add to firestore
                const newDocData = {
                    ...data,
                    createdBy: currentUser.uid,
                    createdByName: currentUser.displayName || currentUser.email?.split("@")[0] || "Staff",
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                };
                
                await addDoc(collection(db, "organizations"), newDocData);
                setToastMessage("Profile saved successfully");
                setTimeout(() => { setToastMessage(null); onClose(); }, 1500);
            } else if (data.id) {
                // Update
                const docRef = doc(db, "organizations", data.id);
                await updateDoc(docRef, {
                    ...data,
                    updatedAt: serverTimestamp()
                });
                setToastMessage("Profile updated successfully");
                setTimeout(() => { setToastMessage(null); onClose(); }, 1500);
            }
        } catch (error: any) {
            console.error("Error saving profile", error);
            alert("Error saving profile: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <AnimatePresence>
                    {toastMessage && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg font-medium text-sm"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            {toastMessage}
                        </motion.div>
                    )}
                </AnimatePresence>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="w-5 h-5 text-indigo-600" />
                        {isEditMode ? "View/Edit Profile" : "Create Organization Profile"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode 
                            ? "View details and update editable fields. Core fields are locked." 
                            : "Create a reusable profile for an Institution or Hospital."}
                    </DialogDescription>
                </DialogHeader>

                {!isEditMode && (
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                        <button
                            type="button"
                            onClick={() => handleTypeSwitch("Institution")}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${orgType === "Institution" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Institution
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeSwitch("Hospital")}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${orgType === "Hospital" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Hospital
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Common Fields */}
                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Organization Name *</label>
                            <input 
                                {...register("organizationName")} 
                                disabled={isEditMode}
                                className={`w-full p-2.5 rounded-lg border text-black placeholder:text-slate-400 ${errors.organizationName ? "border-rose-500" : "border-slate-300"} ${isEditMode ? "bg-slate-100 cursor-not-allowed font-semibold" : "bg-white"}`} 
                            />
                            {errors.organizationName && <p className="text-xs text-rose-500">{errors.organizationName.message}</p>}
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Location / Address *</label>
                            <input {...register("location")} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                            {errors.location && <p className="text-xs text-rose-500">{errors.location.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Contact Number *</label>
                            <input {...register("contactNumber")} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                            {errors.contactNumber && <p className="text-xs text-rose-500">{errors.contactNumber.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" {...register("email")} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Website</label>
                            <input {...register("website")} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                            {errors.website && <p className="text-xs text-rose-500">{errors.website.message}</p>}
                        </div>

                        {/* Institution Specific Fields */}
                        {orgType === "Institution" && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Head of Institution *</label>
                                    <input {...register("headOfInstitution" as any)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                                    {(errors as any).headOfInstitution && <p className="text-xs text-rose-500">{(errors as any).headOfInstitution.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Number of Students</label>
                                    <input type="number" {...register("numberOfStudents" as any)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                                </div>
                            </>
                        )}

                        {/* Hospital Specific Fields */}
                        {orgType === "Hospital" && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Medical Superintendent *</label>
                                    <input {...register("medicalSuperintendent" as any)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                                    {(errors as any).medicalSuperintendent && <p className="text-xs text-rose-500">{(errors as any).medicalSuperintendent.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Specializations</label>
                                    <input {...register("specializations" as any)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Number of Beds</label>
                                    <input type="number" {...register("numberOfBeds" as any)} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                                </div>
                            </>
                        )}

                        <div className="space-y-1 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Notes / Description</label>
                            <textarea {...register("notes")} rows={3} className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? "Saving..." : (isEditMode ? "Save Changes" : "Create Profile")}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
