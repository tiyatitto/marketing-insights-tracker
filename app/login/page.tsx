"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Users, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"admin" | "staff">("staff");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocSnap = await getDoc(doc(db, "users", user.uid));

            let role = null;

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                
                if (userData.disabled === true) {
                    await signOut(auth);
                    setErrorMsg("Account disabled. Contact administrator.");
                    setIsLoading(false);
                    return;
                }
                role = userData.role?.toLowerCase();
            } else if (email === "admin@test.com") {
                // Fallback creation
                await setDoc(doc(db, "users", user.uid), {
                    fullName: "System Admin",
                    email: email,
                    role: "admin",
                    disabled: false,
                    createdAt: serverTimestamp()
                });
                role = "admin";
            }

            if (role === "admin") {
                router.push("/admin");
            } else if (role === "staff") {
                router.push("/staff");
            } else {
                if (userDocSnap.exists()) {
                    setErrorMsg("Unknown role for this user.");
                } else {
                    setErrorMsg("User data not found in our records. Please contact Admin.");
                }
                setIsLoading(false);
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Left Branding Panel (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white items-center justify-center p-12">
                <div className="absolute top-0 -left-12 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 -right-12 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                
                <div className="relative z-10 max-w-xl">
                    <div className="mb-10 inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                        <svg className="h-10 w-10 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                    </div>
                    
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Marketing Insights <span className="text-cyan-300">Tracker</span>
                    </h1>
                    
                    <p className="text-lg text-indigo-200 mb-10 font-medium leading-relaxed">
                        The ultimate command center for managing field marketing, organizing institutional profiles, and tracking operational expenses in real-time.
                    </p>
                    
                    <div className="space-y-5">
                        {[
                            "Intelligent Expense Tracking & Analysis",
                            "Comprehensive Organization Profiles",
                            "Real-time Report Analytics",
                            "Secure Staff & Role Management"
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm"
                            >
                                <div className="p-2 bg-indigo-500/30 rounded-lg text-cyan-300">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-indigo-50">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Login Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Mobile background bubbles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 lg:hidden"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 lg:hidden"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md z-10"
                >
                    <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl p-8 sm:p-10 relative">
                        
                        <div className="mb-8 lg:hidden flex justify-center">
                            <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg">
                                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                        </div>

                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="mb-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">
                                Sign in to your account
                            </p>
                        </div>

                        {/* Role Selector UI */}
                        <div className="flex p-1.5 mb-8 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-inner">
                            <button
                                type="button"
                                onClick={() => setSelectedRole("staff")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                                    selectedRole === "staff" 
                                        ? "bg-white text-indigo-700 shadow-md border border-slate-200" 
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                            >
                                <Users className="w-4 h-4" />
                                Staff Portal
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole("admin")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                                    selectedRole === "admin" 
                                        ? "bg-white text-indigo-700 shadow-md border border-slate-200" 
                                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin Portal
                            </button>
                        </div>

                        <AnimatePresence>
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
                        </AnimatePresence>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-4 py-3.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-slate-700">
                                        Password
                                    </label>
                                    <button 
                                        type="button"
                                        onClick={() => router.push('/forgot-password')} 
                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Lock className="h-5 w-5" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        className="w-full rounded-2xl border border-slate-300 bg-white/50 pl-12 pr-12 py-3.5 text-slate-900 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm font-medium"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-8 w-full flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Sign In Securely"
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}