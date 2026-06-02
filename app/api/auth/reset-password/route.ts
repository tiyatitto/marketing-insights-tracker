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

        // 2. Mock OTP verification happens on frontend before this step
        // In this rebuilt flow, we accept ANY valid recovery email because the user explicitly requested to drop pre-configured checks.

        // 3. Update the password
        await adminAuth.updateUser(authUser.uid, {
            password: newPassword,
        });

        return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });

    } catch (error: any) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ error: error.message || "An internal error occurred." }, { status: 500 });
    }
}
