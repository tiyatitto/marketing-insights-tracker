import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, getDocs, updateDoc, doc, deleteField } from "firebase/firestore";

export async function GET() {
    try {
        const orgsRef = collection(db, "organizations");
        const snapshot = await getDocs(orgsRef);
        
        let migratedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;
        
        const updates = snapshot.docs.map(async (document) => {
            try {
                const data = document.data();
                const type = data.organizationType || "Institution";
                const isHospital = type.toLowerCase() === "hospital";
                
                // Construct standard base fields with defaults
                const updatePayload: any = {
                    organizationName: data.organizationName || "",
                    location: data.location || "",
                    contactNumber: data.contactNumber || "",
                    email: data.email || "",
                    website: data.website || "",
                    notes: data.notes || ""
                };
                
                // Map old fields to new ones, or default to ""
                if (isHospital) {
                    updatePayload.medicalSuperintendent = data.medicalSuperintendent || data.head || data.principal || "";
                    updatePayload.specializations = data.specializations || "";
                    updatePayload.numberOfBeds = data.numberOfBeds || "";
                } else {
                    updatePayload.headOfInstitution = data.headOfInstitution || data.head || data.principal || "";
                    updatePayload.numberOfStudents = data.numberOfStudents || "";
                }
                // Delete legacy fields
                const legacyFields = [
                    "spocName", "spocEmail", "poc", "personOfContact", "coursesOffered",
                    "institutionType", "hospitalType", "principal", "head"
                ];
                legacyFields.forEach(field => {
                    updatePayload[field] = deleteField();
                });
                
                await updateDoc(doc(db, "organizations", document.id), updatePayload);
                migratedCount++;
            } catch (err) {
                console.error("Failed to migrate doc", document.id, err);
                failedCount++;
            }
        });
        
        await Promise.all(updates);
        
        return NextResponse.json({
            success: true,
            migratedCount,
            skippedCount,
            failedCount,
            message: "Migration completed"
        });
        
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
