"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ShieldCheck, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        
        if (!email || !recoveryEmail) {
            setErrorMsg("Please provide both Login Email and Recovery Email.");
            return;
        }
        
        setSuccessMsg("An OTP has been sent to your Recovery Email.");
        setStep(2);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!otp || otp.length < 4) {
            setErrorMsg("Please enter a valid OTP.");
            return;
        }

        // Simulate OTP success
        setSuccessMsg("OTP Verified! You can now reset your password.");
        setStep(3);
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, recoveryEmail, newPassword })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password.");
            }

            setSuccessMsg("Password successfully reset! Redirecting to login...");
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setErrorMsg(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white items-center justify-center p-12">
                <div className="absolute top-0 -left-12 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 -right-12 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10 max-w-xl">
                    <button 
                        onClick={() => router.push('/login')}
                        className="mb-10 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-semibold text-sm">Back to Login</span>
                    </button>
                    
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Account <span className="text-cyan-300">Recovery</span>
                    </h1>
                    
                    <p className="text-lg text-indigo-200 mb-10 font-medium leading-relaxed">
                        Follow the steps to securely recover your account. You will need access to your registered Recovery Email address.
                    </p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 lg:hidden"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl p-8 sm:p-10 relative">
                        
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="mb-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                                Reset Password
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                {step === 1 ? "Step 1: Verify Identity" : step === 2 ? "Step 2: Enter OTP" : "Step 3: Create New Password"}
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            {errorMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 text-sm text-rose-600 border border-rose-200 shadow-sm">
                                        <AlertCircle className="h-5 w-5 shrink-0" />
                                        <p className="font-semibold">{errorMsg}</p>
                                    </div>
                                </motion.div>
                            )}
                            {successMsg && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-200 shadow-sm">
                                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                                        <p className="font-semibold">{successMsg}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {step === 1 ? (
                            <motion.form 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerify} 
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Login Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="account@example.com"
                                            required
                                            className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Recovery Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="recovery@example.com"
                                            required
                                            className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-8 w-full flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 hover:bg-indigo-700 active:scale-[0.98]"
                                >
                                    Proceed to Next Step
                                </button>
                                
                                <div className="text-center mt-4 lg:hidden">
                                    <button type="button" onClick={() => router.push('/login')} className="text-sm font-bold text-indigo-600">Back to Login</button>
                                </div>
                            </motion.form>
                        ) : step === 2 ? (
                            <motion.form 
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleVerifyOtp} 
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Verification Code (OTP)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="123456"
                                            required
                                            maxLength={6}
                                            className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium tracking-widest text-center"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 text-center font-medium">Enter the 6-digit code sent to {recoveryEmail}</p>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-8 w-full flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 hover:bg-indigo-700 active:scale-[0.98]"
                                >
                                    Verify OTP
                                </button>
                                
                                <div className="text-center mt-4">
                                    <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-slate-500 hover:text-slate-700">Back to Email</button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.form 
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleReset} 
                                className="space-y-5"
                            >
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                            className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isLoading || !!successMsg}
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500 font-medium">Must be at least 6 characters long.</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !!successMsg}
                                    className="mt-8 w-full flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:shadow-emerald-600/40 hover:bg-emerald-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating...</>
                                    ) : (
                                        "Update Password"
                                    )}
                                </button>
                                
                                {!isLoading && !successMsg && (
                                    <div className="text-center mt-4">
                                        <button type="button" onClick={() => setStep(2)} className="text-sm font-bold text-slate-500 hover:text-slate-700">Go Back</button>
                                    </div>
                                )}
                            </motion.form>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
