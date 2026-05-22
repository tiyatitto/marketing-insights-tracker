"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FormField } from "../ui/FormField";
import { FormTextArea } from "../ui/FormTextArea";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

interface MeetingsActivityFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

type MeetingType = "Institution" | "Hospital" | null;

export function MeetingsActivityForm({ formData, handleInputChange, setFormData }: MeetingsActivityFormProps) {
  const [meetingType, setMeetingType] = useState<MeetingType>(formData.meetingType || null);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [availableOrganizations, setAvailableOrganizations] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch organizations from Firestore
  useEffect(() => {
    const q = query(collection(db, "organizations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrganizations(orgs);
    });
    return () => unsubscribe();
  }, []);

  // Filter organizations based on meetingType
  useEffect(() => {
    if (meetingType) {
      setAvailableOrganizations(organizations.filter(o => o.organizationType === meetingType));
    } else {
      setAvailableOrganizations([]);
    }
  }, [meetingType, organizations]);

  useEffect(() => {
    if (formData.meetingType !== meetingType) {
      setMeetingType(formData.meetingType || null);
    }
  }, [formData.meetingType, meetingType]);

  const handleMeetingTypeChange = (type: MeetingType) => {
    setMeetingType(type);
    setSelectedOrganizationId("");
    setSearchQuery("");
    
    // Clear form data
    setFormData({});
    handleInputChange({ target: { name: "meetingType", value: type } } as any);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedOrganizationId("");
    setShowDropdown(true);
    
    // Auto-update the typed name to the new form data so it's saved as "New Organization" if not selected
    if (meetingType === "Institution") {
        handleInputChange({ target: { name: "institutionName", value: e.target.value } } as any);
    } else if (meetingType === "Hospital") {
        handleInputChange({ target: { name: "hospitalName", value: e.target.value } } as any);
    }
  };

  const handleOrganizationSelect = (org: any) => {
    setSelectedOrganizationId(org.id);
    setSearchQuery(org.organizationName);
    setShowDropdown(false);

    // Auto-fill fields
    const newFormData: any = { ...formData };
    newFormData.meetingType = meetingType;
    newFormData.organizationId = org.id;
    newFormData.isNewOrganization = false;

    if (org.commonDetails) {
        Object.keys(org.commonDetails).forEach(key => {
            // Don't override cost, observation, and specific meeting fields
            if (!["costOfVisit", "marketingObservation", "marketingConclusion", "feedback", "personOfContact"].includes(key)) {
                newFormData[key] = org.commonDetails[key];
            }
        });
    }

    setFormData(newFormData);
  };

  const handleCreateNew = () => {
    setShowDropdown(false);
    setSelectedOrganizationId("");
    // Ensure form is set to treat this as a new org
    const newFormData: any = { ...formData, isNewOrganization: true };
    setFormData(newFormData);
  };

  const isFieldEmpty = (fieldName: string) => {
      // Return true if the field is expected to be filled but is empty (to apply glow)
      return selectedOrganizationId && !formData[fieldName];
  };

  const getGlowClass = (fieldName: string) => {
      return isFieldEmpty(fieldName) ? "ring-2 ring-indigo-400 border-indigo-400 bg-indigo-50/30" : "";
  };

  const filteredOrgs = availableOrganizations.filter(org => 
      org.organizationName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Meeting Type Selection */}
      <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
        <label className="block text-sm font-bold text-slate-900 mb-3">Select Meeting Type</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleMeetingTypeChange("Institution")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              meetingType === "Institution" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white text-slate-700 border border-slate-300 hover:border-indigo-300"
            }`}
          >
            Institution
          </button>
          <button
            type="button"
            onClick={() => handleMeetingTypeChange("Hospital")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              meetingType === "Hospital" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white text-slate-700 border border-slate-300 hover:border-indigo-300"
            }`}
          >
            Hospital
          </button>
        </div>
      </div>

      {meetingType && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative z-50 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-sm font-bold text-slate-900 mb-3">
            Search or Add {meetingType} Name
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowDropdown(true)}
            placeholder={`Type to search or add new ${meetingType.toLowerCase()}...`}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium relative z-50"
          />
          <AnimatePresence>
              {showDropdown && searchQuery.trim().length > 0 && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <motion.div 
                    initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                    className="absolute z-50 mt-2 left-5 right-5 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl"
                >
                  {filteredOrgs.length > 0 ? (
                      <>
                        <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested matches</div>
                        {filteredOrgs.map((org) => (
                            <button
                            key={org.id}
                            type="button"
                            onClick={() => handleOrganizationSelect(org)}
                            className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-slate-100 last:border-0"
                            >
                            <span className="font-semibold text-slate-900">{org.organizationName}</span>
                            <span className="block text-xs text-slate-500 mt-0.5">{org.location || "No location set"}</span>
                            </button>
                        ))}
                      </>
                  ) : (
                    <div className="px-4 py-4 text-sm text-slate-600 bg-amber-50">
                        <span className="font-semibold text-amber-800 block mb-1">Did you mean:</span>
                        No similar organizations found.
                    </div>
                  )}
                  <button 
                      type="button"
                      onClick={handleCreateNew}
                      className="w-full text-left px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors sticky bottom-0 font-semibold flex items-center gap-2 shadow-lg"
                  >
                      <span>+</span> Continue with "{searchQuery}" as New {meetingType}
                  </button>
                </motion.div>
                </>
              )}
          </AnimatePresence>
          <p className="mt-2 text-xs text-slate-600">
            💡 Selecting an existing organization will auto-fill common details. Empty highlighted fields require your input.
          </p>
        </motion.div>
      )}

      {/* Forms Content */}
      <div className="relative z-10">
      {meetingType === "Institution" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 bg-indigo-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-indigo-900">Institution Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 space-y-4 md:space-y-0">
            <div className={getGlowClass("location")}><FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("numStudents")}><FormField label="Number of Final Year Students" type="number" name="numStudents" value={formData.numStudents || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("headOfInstitute")}><FormField label="Head of Institution" name="headOfInstitute" value={formData.headOfInstitute || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("headContact")}><FormField label="Head Contact" name="headContact" value={formData.headContact || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("spocName")}><FormField label="SPOC Name" name="spocName" value={formData.spocName || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("spocContact")}><FormField label="SPOC Contact" name="spocContact" value={formData.spocContact || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("spocEmail")}><FormField label="SPOC Email" type="email" name="spocEmail" value={formData.spocEmail || ""} onChange={handleInputChange} /></div>
            <div><FormField label="Meeting Date" type="date" name="eventDate" value={formData.eventDate || ""} onChange={handleInputChange} /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 space-y-4 md:space-y-0 mt-4">
            <div><FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} /></div>
          </div>
          <div className="mt-4"><FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} /></div>
        </motion.div>
      )}

      {meetingType === "Hospital" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-5 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl border border-cyan-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 bg-cyan-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-cyan-900">Hospital Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 space-y-4 md:space-y-0">
            <div className={getGlowClass("location")}><FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("numBeds")}><FormField label="Number of Beds" type="number" name="numBeds" value={formData.numBeds || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("numEmployees")}><FormField label="Number of Employees" type="number" name="numEmployees" value={formData.numEmployees || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("headOfHospital")}><FormField label="Head of Hospital" name="headOfHospital" value={formData.headOfHospital || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("contact")}><FormField label="Head Contact" name="contact" value={formData.contact || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("headOfHR")}><FormField label="HR Name" name="headOfHR" value={formData.headOfHR || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("hrContact")}><FormField label="HR Contact" name="hrContact" value={formData.hrContact || ""} onChange={handleInputChange} /></div>
            <div className={getGlowClass("emailContact")}><FormField label="Email Contact" type="email" name="emailContact" value={formData.emailContact || ""} onChange={handleInputChange} /></div>
            <div><FormField label="Meeting Date" type="date" name="eventDate" value={formData.eventDate || ""} onChange={handleInputChange} /></div>
            <div><FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} /></div>
            <div><FormField label="Person of Contact" name="personOfContact" value={formData.personOfContact || ""} onChange={handleInputChange} /></div>
          </div>
          <div className="mt-4"><FormTextArea label="Marketing Conclusion" name="marketingConclusion" value={formData.marketingConclusion || ""} onChange={handleInputChange} /></div>
        </motion.div>
      )}
      </div>

      {!meetingType && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-300">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-600 font-medium">Select a meeting type above to get started</p>
          <p className="text-sm text-slate-500 mt-2">Choose between Institution or Hospital to fill out the form</p>
        </motion.div>
      )}
    </motion.div>
  );
}
