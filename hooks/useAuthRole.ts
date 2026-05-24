import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export function useAuthRole() {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                setUser(null);
                setRole(null);
                setLoading(false);
                return;
            }

            try {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));

                console.log("Auth Check:", {
                    uid: currentUser.uid,
                    exists: userDoc.exists(),
                    role: userDoc.exists() ? userDoc.data().role : "missing"
                });

                if (userDoc.exists()) {
                    setRole(userDoc.data().role?.toLowerCase() || null);
                } else {
                    if (currentUser.email === "admin@test.com") {
                        console.log("Auto-creating missing admin document...");
                        await setDoc(doc(db, "users", currentUser.uid), {
                            fullName: "System Admin",
                            email: currentUser.email,
                            role: "admin",
                            disabled: false,
                            createdAt: serverTimestamp()
                        });
                        setRole("admin");
                    } else {
                        console.error("User document missing in Firestore");
                        setRole(null);
                    }
                }
            } catch (err) {
                console.error("Error fetching user role:", err);
                setRole(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return { user, role, loading };
}
