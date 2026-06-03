import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const { email, recoveryEmail, newPassword } = await req.json();

        if (!email || !recoveryEmail || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Look up user by email in Auth
        let authUser;
        try {
            authUser = await adminAuth.getUserByEmail(email);
        } catch (authError: any) {
            if (authError.code === "auth/user-not-found") {
                return NextResponse.json({ error: "No account found with this login email." }, { status: 404 });
            }
            throw authError;
        }

        // 2. Verify OTP was successfully completed
        const otpDocRef = adminDb.collection("otps").doc(email);
        const otpDoc = await otpDocRef.get();

        if (!otpDoc.exists || !otpDoc.data()?.verified) {
            return NextResponse.json({ error: "Unauthorized password reset attempt. OTP not verified." }, { status: 403 });
        }

        // 3. Update the password
        await adminAuth.updateUser(authUser.uid, {
            password: newPassword,
        });

        // 4. Clean up OTP document
        await otpDocRef.delete();

        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: error.message || "An internal error occurred." }, { status: 500 });
    }
}
