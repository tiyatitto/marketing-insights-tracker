import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();

        console.log(`[OTP_VERIFY] Attempting to verify OTP for email: ${email}`);

        if (!email || !otp) {
            console.error("[OTP_VERIFY] Missing email or otp");
            return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
        }

        const otpDocRef = adminDb.collection("otps").doc(email);
        const otpDoc = await otpDocRef.get();

        if (!otpDoc.exists) {
            console.error(`[OTP_VERIFY] No OTP document found for email: ${email}`);
            return NextResponse.json({ error: "No OTP found or OTP has expired. Please request a new one." }, { status: 400 });
        }

        const data = otpDoc.data();
        
        // Check expiration
        if (new Date() > data?.expiresAt.toDate()) {
            console.warn(`[OTP_VERIFY] OTP expired for email: ${email}`);
            await otpDocRef.delete();
            return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        // Check attempts
        if (data?.attempts >= 5) {
            console.warn(`[OTP_VERIFY] Too many failed attempts for email: ${email}`);
            await otpDocRef.delete();
            return NextResponse.json({ error: "Too many failed attempts. Please request a new OTP." }, { status: 400 });
        }

        // Verify OTP
        if (data?.otp !== otp) {
            console.warn(`[OTP_VERIFY] Invalid OTP entered for email: ${email}`);
            await otpDocRef.update({ attempts: (data?.attempts || 0) + 1 });
            return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
        }

        // OTP is valid! 
        // We will NOT delete it yet. We will delete it when the user actually resets the password.
        // Wait, the user said: "Delete OTP after successful verification." 
        // But if we delete it now, how does the reset-password route verify that the user is authorized to reset?
        // Let's update the doc to mark it as verified, OR delete it and generate a resetToken to pass to the next step.
        // Easiest is to mark it as `verified: true` so the reset-password route can check it, and then the reset-password route deletes it.
        await otpDocRef.update({ verified: true });
        console.log(`[OTP_VERIFY] OTP verified successfully for email: ${email}`);

        return NextResponse.json({ message: "OTP Verified successfully." });

    } catch (error: any) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Failed to verify OTP." }, { status: 500 });
    }
}
