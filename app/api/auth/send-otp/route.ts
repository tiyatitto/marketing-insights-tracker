import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { email, recoveryEmail } = await req.json();

        console.log("[OTP_SEND] Request received for:", email);

        if (!email || !recoveryEmail) {
            console.error("[OTP_SEND] Missing email or recoveryEmail");
            return NextResponse.json({ error: "Login Email and Recovery Email are required." }, { status: 400 });
        }

        console.log("[OTP_SEND] Checking ENV variables: EMAIL_USER is", process.env.EMAIL_USER ? "SET" : "MISSING");
        const isEmailConfigured = !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;
        if (!isEmailConfigured) {
            console.error("[OTP_SEND] ENV variables missing. Real OTP cannot be sent.");
            return NextResponse.json({ 
                error: "Email service unavailable. Please configure EMAIL_USER and EMAIL_PASS as App Passwords in your .env.local file to use the Forgot Password flow." 
            }, { status: 500 });
        }

        // Verify the login email actually exists
        let userRecord;
        try {
            userRecord = await adminAuth.getUserByEmail(email);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                return NextResponse.json({ error: "No user found with this Login Email." }, { status: 404 });
            }
            throw error;
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Save OTP to Firestore
        await adminDb.collection("otps").doc(email).set({
            otp,
            recoveryEmail,
            expiresAt,
            attempts: 0
        });



        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recoveryEmail,
            subject: 'Marketing Insights Tracker - Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <p style="color: #334155; font-size: 16px;">Your OTP for password reset is:</p>
                    <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a;">${otp}</span>
                    </div>
                    <p style="color: #334155; font-size: 16px;">This OTP will expire in 5 minutes.</p>
                    <p style="color: #64748b; font-size: 14px;">If you did not request this reset, please ignore this email.</p>
                </div>
            `
        };

        // Verify SMTP connection
        try {
            console.log("[OTP_SEND] Verifying Nodemailer transporter connection...");
            await transporter.verify();
            console.log("[OTP_SEND] Transporter connection verified successfully.");
        } catch (verifyError: any) {
            console.error("[OTP_SEND] SMTP Verification Failed:", verifyError);
            return NextResponse.json({ error: `SMTP Authentication failed: ${verifyError.message}` }, { status: 500 });
        }

        console.log("[OTP_SEND] Sending email to:", recoveryEmail);
        try {
            await transporter.sendMail(mailOptions);
            console.log("[OTP_SEND] Email sent successfully.");
        } catch (sendError: any) {
            console.error("[OTP_SEND] Failed to send email:", sendError);
            return NextResponse.json({ error: `Failed to send email: ${sendError.message}` }, { status: 500 });
        }

        return NextResponse.json({ message: "OTP sent successfully." });

    } catch (error: any) {
        console.error("[OTP_SEND] Critical Error:", error);
        return NextResponse.json({ error: error.message || "Failed to send OTP. Please try again." }, { status: 500 });
    }
}
