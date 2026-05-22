import React from "react";
import { motion } from "framer-motion";
import { FormField } from "../ui/FormField";
import { FormTextArea } from "../ui/FormTextArea";
import { MeetingsActivityForm } from "./MeetingsActivityForm";

interface StaffReportFormProps {
    activityType: string;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function StaffReportForm({ activityType, formData, handleInputChange, setFormData }: StaffReportFormProps) {
    switch (activityType) {
        case "Meeting with Organization":
            return (
                <MeetingsActivityForm
                    formData={formData}
                    handleInputChange={handleInputChange}
                    setFormData={setFormData}
                />
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
        default:
            return null;
    }
}
