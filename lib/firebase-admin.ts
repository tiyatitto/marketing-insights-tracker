import admin from "firebase-admin";
import serviceAccount from "@/config/marketing-insights-tracker-firebase-adminsdk-fbsvc-e3ac23cd93.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      serviceAccount as admin.ServiceAccount
    ),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();