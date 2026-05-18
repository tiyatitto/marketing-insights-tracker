import React from "react";
import { motion } from "framer-motion";
import { FormField } from "../ui/FormField";
import { FormTextArea } from "../ui/FormTextArea";

interface StaffReportFormProps {
    activityType: string;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function StaffReportForm({ activityType, formData, handleInputChange }: StaffReportFormProps) {
    switch (activityType) {
        case "Meetings with Institutes":
            return (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Institution Name" name="institutionName" value={formData.institutionName || ""} onChange={handleInputChange} />
                        <FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                        <FormField label="Number of Final Year Students" type="number" name="numStudents" value={formData.numStudents || ""} onChange={handleInputChange} />
                        <FormField label="Head of Institute" name="headOfInstitute" value={formData.headOfInstitute || ""} onChange={handleInputChange} />
                        <FormField label="Head Contact" name="headContact" value={formData.headContact || ""} onChange={handleInputChange} />
                        <FormField label="SPOC from Institute" name="spocName" value={formData.spocName || ""} onChange={handleInputChange} />
                        <FormField label="SPOC Contact" name="spocContact" value={formData.spocContact || ""} onChange={handleInputChange} />
                        <FormField label="SPOC Email" type="email" name="spocEmail" value={formData.spocEmail || ""} onChange={handleInputChange} />
                        <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} />
                    </div>
                    <FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} />
                </motion.div>
            );
        case "Follow up with Institutes":
        case "Follow up with Hospitals":
            return (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Institution/Hospital Name" name="institution" value={formData.institution || ""} onChange={handleInputChange} />
                        <FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                        <FormField label="Date" type="date" name="date" value={formData.date || ""} onChange={handleInputChange} />
                        <FormField label="Mode of Meeting" name="modeOfMeeting" value={formData.modeOfMeeting || ""} onChange={handleInputChange} />
                        <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} />
                    </div>
                    <FormTextArea label="Feedback from Client" name="feedback" value={formData.feedback || ""} onChange={handleInputChange} />
                    <FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} />
                </motion.div>
            );
        case "Campaigns Conducted":
            return (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Institution Name" name="institution" value={formData.institution || ""} onChange={handleInputChange} />
                        <FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                        <FormField label="Number of Students Attended" type="number" name="studentsAttended" value={formData.studentsAttended || ""} onChange={handleInputChange} />
                        <FormField label="Number of Students Registered" type="number" name="studentsRegistered" value={formData.studentsRegistered || ""} onChange={handleInputChange} />
                        <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} />
                    </div>
                    <FormTextArea label="List of Students Captured" name="studentsCaptured" value={formData.studentsCaptured || ""} onChange={handleInputChange} />
                    <FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} />
                </motion.div>
            );
        case "Participation in Conferences":
            return (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Conference Name" name="conferenceName" value={formData.conferenceName || ""} onChange={handleInputChange} />
                        <FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                        <FormField label="Target Professionals" name="targetProfessionals" value={formData.targetProfessionals || ""} onChange={handleInputChange} />
                        <FormField label="Number of Participants" type="number" name="numParticipants" value={formData.numParticipants || ""} onChange={handleInputChange} />
                        <FormField label="Footfalls of Participants" type="number" name="footfalls" value={formData.footfalls || ""} onChange={handleInputChange} />
                        <FormField label="Number of Registrations" type="number" name="numRegistrations" value={formData.numRegistrations || ""} onChange={handleInputChange} />
                        <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} />
                    </div>
                    <FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} />
                </motion.div>
            );
        case "Meetings with Hospitals":
            return (
                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <FormField label="Hospital Name" name="hospitalName" value={formData.hospitalName || ""} onChange={handleInputChange} />
                        <FormField label="Location" name="location" value={formData.location || ""} onChange={handleInputChange} />
                        <FormField label="Number of Beds" type="number" name="numBeds" value={formData.numBeds || ""} onChange={handleInputChange} />
                        <FormField label="Number of Employees" type="number" name="numEmployees" value={formData.numEmployees || ""} onChange={handleInputChange} />
                        <FormField label="Head of Hospital" name="headOfHospital" value={formData.headOfHospital || ""} onChange={handleInputChange} />
                        <FormField label="Contact" name="contact" value={formData.contact || ""} onChange={handleInputChange} />
                        <FormField label="Head of HR" name="headOfHR" value={formData.headOfHR || ""} onChange={handleInputChange} />
                        <FormField label="HR Contact" name="hrContact" value={formData.hrContact || ""} onChange={handleInputChange} />
                        <FormField label="Email Contact" type="email" name="emailContact" value={formData.emailContact || ""} onChange={handleInputChange} />
                        <FormField label="Cost of Visit ($)" type="number" name="costOfVisit" value={formData.costOfVisit || ""} onChange={handleInputChange} />
                    </div>
                    <FormTextArea label="Marketing Observation" name="marketingObservation" value={formData.marketingObservation || ""} onChange={handleInputChange} />
                </motion.div>
            );
        default:
            return null;
    }
}
