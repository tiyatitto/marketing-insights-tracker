"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormField } from "../ui/FormField";
import { FormTextArea } from "../ui/FormTextArea";
import { db } from "../../lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { CheckCircle2, ChevronDown, ChevronUp, Edit2, MapPin, Building2, UserCircle } from "lucide-react";

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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  // New States for UX Enhancements
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Date Restrictions
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  };

  const maxDate = formatDate(today);
  const minDate = formatDate(yesterday);

  // Fetch organizations from Firestore
  useEffect(() => {
    const q = query(collection(db, "organizations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const orgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrganizations(orgs);
    });
    return () => unsubscribe();
  }, []);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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
    setIsDetailsCollapsed(false);
    setSelectedIndex(-1);
    
    // Clear form data
    setFormData({ meetingType: type });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedOrganizationId("");
    setShowDropdown(true);
    setIsDetailsCollapsed(false);
    setSelectedIndex(-1);
    
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
    setSelectedIndex(-1);

    const newFormData: any = { ...formData };
    newFormData.meetingType = meetingType;
    newFormData.organizationId = org.id;
    newFormData.isNewOrganization = false;

    if (org.organizationType === "Institution") newFormData.institutionName = org.organizationName;
    if (org.organizationType === "Hospital") newFormData.hospitalName = org.organizationName;

    // Auto-fill specified fields
    const autoFillFields = [
        "organizationName", "location", "email", "contactNumber", "website", 
        "numberOfBeds", "specializations", "numberOfStudents",
        "headOfInstitution", "medicalSuperintendent", "notes"
    ];

    autoFillFields.forEach(field => {
        newFormData[field] = org[field] || "";
    });

    setFormData(newFormData);
    setIsDetailsCollapsed(true); // Auto-collapse the static data!
  };

  const handleCreateNew = () => {
    setShowDropdown(false);
    setSelectedOrganizationId("");
    setIsDetailsCollapsed(false);
    
    // Clean stale autofilled data, preserve new state
    const newFormData: any = {
        meetingType: meetingType,
        isNewOrganization: true
    };
    
    const cleanName = searchQuery.trim();
    if (meetingType === "Institution") newFormData.institutionName = cleanName;
    if (meetingType === "Hospital") newFormData.hospitalName = cleanName;
    
    setFormData(newFormData);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredOrgs.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOrgs.length) {
        handleOrganizationSelect(filteredOrgs[selectedIndex]);
      } else if (searchQuery.trim().length > 0) {
        handleCreateNew();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const isFieldEmpty = (fieldName: string) => {
      // Glow if an organization is selected OR if it's a new organization flow, and the field is missing
      return (selectedOrganizationId || formData.isNewOrganization) && !formData[fieldName];
  };

  const getMissingFields = () => {
      if (!selectedOrganizationId) return [];
      const missing = [];
      if (!formData.location) missing.push("Location");
      if (!formData.contactNumber) missing.push("Contact Number");
      if (meetingType === "Institution" && !formData.headOfInstitution) missing.push("Head of Institution");
      if (meetingType === "Hospital" && !formData.medicalSuperintendent) missing.push("Medical Superintendent");
      return missing;
  };
  const missingFields = getMissingFields();
  const isProfileIncomplete = selectedOrganizationId && missingFields.length > 0;

  const renderField = (name: string, label: string, type = "text", required = false) => {
      const empty = isFieldEmpty(name);
      // If we are collapsed and it's an existing org, only render if it's empty
      if (isDetailsCollapsed && selectedOrganizationId && !empty) return null;
      
      return (
          <FormField 
             label={label} 
             name={name} 
             type={type}
             value={formData[name] || ""} 
             onChange={handleInputChange} 
             requiredAttention={empty && required} 
          />
      );
  };

  // Sort dropdown: Exact matches first, then by recency (createdAt), then alphabetically
  const cleanSearch = debouncedQuery.toLowerCase().trim();
  const filteredOrgs = availableOrganizations
    .filter(org => org.organizationName?.toLowerCase().includes(cleanSearch))
    .sort((a, b) => {
        const aExact = a.organizationName?.toLowerCase().trim() === cleanSearch;
        const bExact = b.organizationName?.toLowerCase().trim() === cleanSearch;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Sort by recency (createdAt desc)
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        if (timeB !== timeA) return timeB - timeA;
        
        return a.organizationName?.localeCompare(b.organizationName);
    });

  const exactMatchExists = availableOrganizations.some(
      org => org.organizationName?.toLowerCase().trim() === searchQuery.toLowerCase().trim()
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
            onKeyDown={handleKeyDown}
            placeholder={`Type to search or add new ${meetingType.toLowerCase()}...`}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium relative z-50"
          />
          <AnimatePresence>
              {showDropdown && searchQuery.trim().length > 0 && (
                <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <motion.div 
                    initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}}
                    className="absolute z-50 mt-2 left-5 right-5 max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col"
                    ref={dropdownRef}
                >
                  {filteredOrgs.length > 0 ? (
                      <>
                        <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-100 z-10">Suggested matches</div>
                        {filteredOrgs.map((org, index) => (
                            <button
                            key={org.id}
                            type="button"
                            onClick={() => handleOrganizationSelect(org)}
                            className={`w-full text-left px-4 py-3 transition-colors border-b border-slate-100 last:border-0 ${selectedIndex === index ? "bg-indigo-50 border-l-4 border-l-indigo-500" : "hover:bg-slate-50 border-l-4 border-l-transparent"}`}
                            >
                            <span className="font-semibold text-slate-900">{org.organizationName}</span>
                            <span className="block text-xs text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3"/> {org.location || "No location set"} &bull; SPOC: {org.spocName || "N/A"}</span>
                            </button>
                        ))}
                      </>
                  ) : organizations.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-slate-600 bg-amber-50">
                        <span className="font-semibold text-amber-800 block mb-1">Did you mean:</span>
                        No organization profiles created yet.
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-sm text-slate-600 bg-amber-50">
                        <span className="font-semibold text-amber-800 block mb-1">Did you mean:</span>
                        No similar organizations found.
                    </div>
                  )}
                  {!exactMatchExists && (
                      <button 
                          type="button"
                          onClick={handleCreateNew}
                          className={`w-full text-left px-4 py-3 bg-indigo-600 text-white transition-colors sticky bottom-0 font-semibold flex items-center gap-2 shadow-lg ${selectedIndex === -1 && filteredOrgs.length === 0 ? "bg-indigo-700" : "hover:bg-indigo-700"}`}
                      >
                          <span>+</span> Continue with "{searchQuery.trim()}" as New {meetingType}
                      </button>
                  )}
                </motion.div>
                </>
              )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Forms Content */}
      <div className="relative z-10 space-y-6">
      
      {/* ---------------- INSTITUTION FORM ---------------- */}
      {meetingType === "Institution" && selectedOrganizationId && isDetailsCollapsed && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-5 bg-white/80 backdrop-blur-xl rounded-2xl border ${isProfileIncomplete ? 'border-amber-300 shadow-amber-100' : 'border-indigo-100'} shadow-md`}>
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-indigo-500" /> {formData.institutionName}
                          {isProfileIncomplete && (
                              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">Profile Incomplete</span>
                          )}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/> {formData.location || <span className="text-amber-500 italic">Missing Location</span>}</p>
                  </div>
                  <button type="button" onClick={() => setIsDetailsCollapsed(false)} className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit Details
                  </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${formData.numberOfStudents ? 'text-emerald-500' : 'text-slate-300'}`} /> {formData.numberOfStudents || 0} Students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${formData.headOfInstitution ? 'text-emerald-500' : 'text-amber-500'}`} /> {formData.headOfInstitution || <span className="text-amber-500 italic">Missing Head</span>}
                  </div>
              </div>
          </motion.div>
      )}

      {meetingType === "Institution" && (!isDetailsCollapsed || isProfileIncomplete || !selectedOrganizationId) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-4 p-5 rounded-xl border ${isDetailsCollapsed && isProfileIncomplete ? 'bg-amber-50/50 border-amber-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className={`h-1 w-1 rounded-full ${isDetailsCollapsed && isProfileIncomplete ? 'bg-amber-500' : 'bg-indigo-600'}`}></div>
                <h3 className={`text-sm font-bold ${isDetailsCollapsed && isProfileIncomplete ? 'text-amber-900' : 'text-indigo-900'}`}>
                    {isDetailsCollapsed && isProfileIncomplete ? "Missing Required Fields" : "Institution Details"}
                </h3>
            </div>
            {selectedOrganizationId && !isDetailsCollapsed && (
                <button type="button" onClick={() => setIsDetailsCollapsed(true)} className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                    <ChevronUp className="w-3 h-3" /> Collapse
                </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {renderField("location", "Location", "text", true)}
            {renderField("contactNumber", "Contact Number", "text", true)}
            {renderField("email", "Email", "email")}
            {renderField("website", "Website")}
            {renderField("headOfInstitution", "Head of Institution", "text", true)}
            {renderField("numberOfStudents", "Number of Students", "number")}
          </div>
        </motion.div>
      )}

      {/* ---------------- HOSPITAL FORM ---------------- */}
      {meetingType === "Hospital" && selectedOrganizationId && isDetailsCollapsed && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-5 bg-white/80 backdrop-blur-xl rounded-2xl border ${isProfileIncomplete ? 'border-amber-300 shadow-amber-100' : 'border-cyan-100'} shadow-md`}>
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-cyan-600" /> {formData.hospitalName}
                          {isProfileIncomplete && (
                              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">Profile Incomplete</span>
                          )}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/> {formData.location || <span className="text-amber-500 italic">Missing Location</span>}</p>
                  </div>
                  <button type="button" onClick={() => setIsDetailsCollapsed(false)} className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors">
                      <Edit2 className="w-3 h-3" /> Edit Details
                  </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${formData.numberOfBeds ? 'text-emerald-500' : 'text-slate-300'}`} /> {formData.numberOfBeds || 0} Beds
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 ${formData.medicalSuperintendent ? 'text-emerald-500' : 'text-amber-500'}`} /> {formData.medicalSuperintendent || <span className="text-amber-500 italic">Missing Med. Supt.</span>}
                  </div>
              </div>
          </motion.div>
      )}

      {meetingType === "Hospital" && (!isDetailsCollapsed || isProfileIncomplete || !selectedOrganizationId) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`space-y-4 p-5 rounded-xl border ${isDetailsCollapsed && isProfileIncomplete ? 'bg-amber-50/50 border-amber-200' : 'bg-gradient-to-br from-emerald-50 to-cyan-50 border-cyan-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <div className={`h-1 w-1 rounded-full ${isDetailsCollapsed && isProfileIncomplete ? 'bg-amber-500' : 'bg-cyan-600'}`}></div>
                <h3 className={`text-sm font-bold ${isDetailsCollapsed && isProfileIncomplete ? 'text-amber-900' : 'text-cyan-900'}`}>
                    {isDetailsCollapsed && isProfileIncomplete ? "Missing Required Fields" : "Hospital Details"}
                </h3>
            </div>
            {selectedOrganizationId && !isDetailsCollapsed && (
                <button type="button" onClick={() => setIsDetailsCollapsed(true)} className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-lg hover:bg-cyan-200 transition-colors">
                    <ChevronUp className="w-3 h-3" /> Collapse
                </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {renderField("location", "Location", "text", true)}
            {renderField("contactNumber", "Contact Number", "text", true)}
            {renderField("email", "Email", "email")}
            {renderField("website", "Website")}
            {renderField("medicalSuperintendent", "Medical Superintendent", "text", true)}
            {renderField("specializations", "Specializations")}
            {renderField("numberOfBeds", "Number of Beds", "number")}
          </div>
        </motion.div>
      )}

      {/* ---------------- REPORT SPECIFIC FIELDS (ALWAYS VISIBLE) ---------------- */}
      {meetingType && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-1 bg-rose-500 rounded-full"></div>
                <h3 className="text-sm font-bold text-slate-900">Current Visit Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormField label="Meeting Date" type="date" name="eventDate" min={minDate} max={maxDate} value={formData.eventDate || ""} onChange={handleInputChange} requiredAttention={isFieldEmpty("eventDate")} />
                <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} requiredAttention={isFieldEmpty("costOfVisit")} />
                <FormField label="Person of Contact (Today)" name="personOfContact" value={formData.personOfContact || ""} onChange={handleInputChange} requiredAttention={isFieldEmpty("personOfContact")} />
            </div>
            
            <FormTextArea label={meetingType === "Institution" ? "Marketing Observation" : "Marketing Conclusion"} name={meetingType === "Institution" ? "marketingObservation" : "marketingConclusion"} value={meetingType === "Institution" ? formData.marketingObservation || "" : formData.marketingConclusion || ""} onChange={handleInputChange} requiredAttention={isFieldEmpty(meetingType === "Institution" ? "marketingObservation" : "marketingConclusion")} />
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
