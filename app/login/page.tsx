"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        setErrorMsg("");
        
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                
                if (userData.role === "admin") {
                    router.push("/admin");
                } else if (userData.role === "staff") {
                    router.push("/staff");
                } else {
                    setErrorMsg("Unknown role for this user.");
                    setIsLoading(false);
                }
            } else {
                setErrorMsg("User data not found in our records.");
                setIsLoading(false);
            }
        } catch (error: any) {
            setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl sm:p-10">
                {/* Logo Placeholder */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <svg
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        ></path>
                    </svg>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-gray-500">
                        Sign in to Marketing Insights Tracker
                    </p>
                </div>

                {errorMsg && (
                    <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
                        {errorMsg}
                    </div>
                )}

                <div className="space-y-5">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full rounded-lg border border-gray-300 p-3 text-black placeholder-gray-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="mt-6 w-full flex items-center justify-center rounded-lg bg-blue-600 p-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}