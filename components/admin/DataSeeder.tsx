"use client";

import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, doc, runTransaction, serverTimestamp, setDoc } from "firebase/firestore";
import { DatabaseZap } from "lucide-react";

export function DataSeeder() {
    const [isSeeding, setIsSeeding] = useState(false);

    const STAFF_MEMBERS = [
        { uid: "MT001", name: "Marketeer 001", email: "mt001@demo.com" },
        { uid: "MT002", name: "Marketeer 002", email: "mt002@demo.com" },
        { uid: "MT003", name: "Marketeer 003", email: "mt003@demo.com" },
        { uid: "MT004", name: "Marketeer 004", email: "mt004@demo.com" }
    ];

    const ACTIVITIES = [
        "Meeting with Organization",
        "Follow up with Institutes",
        "Campaigns Conducted",
        "Participation in Conferences",
        "Promotional Activities",
        "Marketing Activities"
    ];

    const ORGANIZATIONS = [
        { name: "Marian College", type: "Institution", location: "Kuttikkanam" },
        { name: "Rajagiri School of Engineering", type: "Institution", location: "Kochi" },
        { name: "Medical Trust Hospital", type: "Hospital", location: "Kochi" },
        { name: "Aster Medcity", type: "Hospital", location: "Cheranallur" },
        { name: "Sunrise Hospital", type: "Hospital", location: "Kakkanad" },
        { name: "Sacred Heart College", type: "Institution", location: "Thevara" },
        { name: "Lourdes Hospital", type: "Hospital", location: "Ernakulam" }
    ];

    const COSTS = ["2000", "5000", "12000", "25000", "40000"];

    const generateRandomDate = (start: Date, end: Date) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    const handleSeedData = async (isAuto = false) => {
        if (!isAuto && !confirm("Are you sure you want to seed realistic reports? This is for development/testing only.")) return;
        
        setIsSeeding(true);
        try {
            for (let i = 0; i < 20; i++) {
                const staff = STAFF_MEMBERS[Math.floor(Math.random() * STAFF_MEMBERS.length)];
                const activity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
                const org = ORGANIZATIONS[Math.floor(Math.random() * ORGANIZATIONS.length)];
                const cost = COSTS[Math.floor(Math.random() * COSTS.length)];
                
                const now = new Date();
                const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
                const randomDate = generateRandomDate(threeMonthsAgo, new Date());
                const formattedDate = randomDate.toISOString().split("T")[0]; // YYYY-MM-DD

                const counterRef = doc(db, "counters", "reports");
                const reportId = await runTransaction(db, async (transaction) => {
                    const counterDoc = await transaction.get(counterRef);
                    let nextSeq = 1;
                    if (counterDoc.exists()) {
                        nextSeq = counterDoc.data().seq + 1;
                    }
                    transaction.set(counterRef, { seq: nextSeq }, { merge: true });
                    return `R${nextSeq.toString().padStart(3, '0')}`;
                });

                const formData = {
                    eventDate: formattedDate,
                    meetingType: org.type,
                    institutionName: org.type === "Institution" ? org.name : "",
                    hospitalName: org.type === "Hospital" ? org.name : "",
                    location: org.location,
                    costOfVisit: cost,
                    observation: `Strategic discussion and evaluation completed at ${org.name}. Discussed partnership opportunities and potential collaboration pipelines.`
                };

                await setDoc(doc(db, "reports", reportId), {
                    creatorId: staff.uid,
                    creatorName: staff.name,
                    creatorEmail: staff.email,
                    activity: activity,
                    name: org.name,
                    cost: cost,
                    status: "Pending",
                    createdAt: serverTimestamp(),
                    formData: formData
                });
            }
            if (!isAuto) alert("Successfully seeded 20 reports!");
        } catch (error) {
            console.error("Seeding failed: ", error);
            if (!isAuto) alert("Error seeding data. Check console.");
        } finally {
            setIsSeeding(false);
        }
    };

    React.useEffect(() => {
        // Auto-seed on first load if it hasn't been seeded locally
        if (typeof window !== "undefined" && !localStorage.getItem("hasAutoSeeded")) {
            localStorage.setItem("hasAutoSeeded", "true");
            handleSeedData(true);
        }
    }, []);

    return (
        <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                isSeeding 
                    ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed" 
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
            }`}
            title="Development/Test Utility: Generates sample reports"
        >
            <DatabaseZap className={`w-4 h-4 ${isSeeding ? "animate-pulse" : ""}`} />
            {isSeeding ? "Seeding Data..." : "Seed Data (Dev Only)"}
        </button>
    );
}
