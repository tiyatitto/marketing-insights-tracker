const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, "../config/marketing-insights-tracker-firebase-adminsdk-fbsvc-e3ac23cd93.json");

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error(`❌ Error: Could not find ${serviceAccountPath}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

const DEMO_EMAILS = [
    "john.m@demo.com",
    "neha.t@demo.com",
    "alan.j@demo.com",
    "maria.p@demo.com",
    "kevin.g@demo.com"
];

async function removeDemoData() {
    console.log("🚀 Starting Demo Data Cleanup...");
    
    // 1. Delete Demo Users from Auth
    const authUsersResult = await auth.listUsers(1000);
    const demoUids = [];
    
    for (const user of authUsersResult.users) {
        if (DEMO_EMAILS.includes(user.email)) {
            demoUids.push(user.uid);
            await auth.deleteUser(user.uid);
            console.log(`✅ Deleted user from Auth: ${user.email}`);
        }
    }
    
    // 2. Delete Demo Users from Firestore 'users' collection
    for (const uid of demoUids) {
        await db.collection("users").doc(uid).delete();
        console.log(`✅ Deleted user document from Firestore: ${uid}`);
    }

    // 3. Delete all reports created by demo users
    const reportsSnapshot = await db.collection("reports").get();
    let reportsDeleted = 0;
    for (const doc of reportsSnapshot.docs) {
        const data = doc.data();
        if (demoUids.includes(data.createdBy) || DEMO_EMAILS.includes(data.creatorEmail)) {
            await doc.ref.delete();
            reportsDeleted++;
        }
    }
    console.log(`✅ Deleted ${reportsDeleted} reports created by demo users.`);
    
    // 4. Delete demo organizations
    // Some orgs were created by demo users
    const orgsSnapshot = await db.collection("organizations").get();
    let orgsDeleted = 0;
    for (const doc of orgsSnapshot.docs) {
        const data = doc.data();
        if (demoUids.includes(data.createdBy)) {
            await doc.ref.delete();
            orgsDeleted++;
        }
    }
    console.log(`✅ Deleted ${orgsDeleted} organizations created by demo users.`);

    // 5. Delete targets (we will seed new predefined ones later)
    const targetsSnapshot = await db.collection("targets").get();
    let targetsDeleted = 0;
    for (const doc of targetsSnapshot.docs) {
        await doc.ref.delete();
        targetsDeleted++;
    }
    console.log(`✅ Deleted ${targetsDeleted} target records (will be re-seeded automatically).`);
    
    console.log("🎉 Demo data cleanup complete!");
    process.exit(0);
}

removeDemoData().catch(console.error);
