import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function GET() {
    try {
        const orgs = [
            {
                organizationType: "Hospital",
                organizationName: "Rajagiri Hospital",
                location: "Chunangamvely, Aluva",
                contactNumber: "0484 290 5000",
                email: "mail@rajagirihospital.com",
                website: "https://www.rajagirihospital.com/",
                medicalSuperintendent: "Dr. Sunny P Orathel",
                specializations: "Cardiology, Neurology, Oncology, Orthopedics",
                numberOfBeds: "500",
                notes: "Multi-specialty quaternary care hospital."
            },
            {
                organizationType: "Hospital",
                organizationName: "Sunshine Hospital",
                location: "Gachibowli, Hyderabad",
                contactNumber: "040 4455 0000",
                email: "info@sunshinehospitals.com",
                website: "https://www.sunshinehospitals.com/",
                medicalSuperintendent: "Dr. A.V. Gurava Reddy",
                specializations: "Orthopedics, Joint Replacement, Trauma",
                numberOfBeds: "350",
                notes: "Leading hospital for joint replacement."
            },
            {
                organizationType: "Hospital",
                organizationName: "Lakeshore Hospital",
                location: "Nettoor, Maradu, Ernakulam",
                contactNumber: "0484 270 1032",
                email: "info@vpslakeshorehospital.com",
                website: "https://www.vpslakeshorehospital.com/",
                medicalSuperintendent: "Dr. H. Ramesh",
                specializations: "Gastroenterology, Oncology, Nephrology",
                numberOfBeds: "600",
                notes: "Comprehensive healthcare center with advanced tech."
            },
            {
                organizationType: "Institution",
                organizationName: "Sacred Heart College",
                location: "Thevara, Ernakulam",
                contactNumber: "0484 287 0504",
                email: "office@shcollege.ac.in",
                website: "https://www.shcollege.ac.in/",
                headOfInstitution: "Rev. Dr. Jose John",
                numberOfStudents: "2500",
                notes: "Premier autonomous college affiliated to MG University."
            },
            {
                organizationType: "Institution",
                organizationName: "MACE Kothamangalam",
                location: "College Avenue, Kothamangalam",
                contactNumber: "0485 282 2363",
                email: "office@mace.ac.in",
                website: "https://www.mace.ac.in/",
                headOfInstitution: "Dr. Bos Mathew Jos",
                numberOfStudents: "3000",
                notes: "Mar Athanasius College of Engineering."
            }
        ];

        for (const org of orgs) {
            await addDoc(collection(db, "organizations"), {
                ...org,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        return NextResponse.json({ success: true, seededCount: orgs.length, message: "Demo organizations seeded" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
