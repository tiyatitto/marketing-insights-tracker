import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

const usersCollection = adminDb.collection("users");

function serializeTimestamp(value: any) {
  if (value && typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }
  return value || null;
}

export async function GET() {
  try {
    const snapshot = await usersCollection.orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        fullName: data.fullName || "",
        username: data.username || "",
        email: data.email || "",
        role: data.role || "staff",
        disabled: data.disabled === true,
        createdAt: serializeTimestamp(data.createdAt),
      };
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Unable to fetch users." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, username, email, password, role } = body;

    if (!fullName || !username || !email || !password || !role) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    const emailQuery = await usersCollection.where("email", "==", email).get();
    if (!emailQuery.empty) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const usernameQuery = await usersCollection.where("username", "==", username).get();
    if (!usernameQuery.empty) {
      return NextResponse.json({ message: "User ID already exists" }, { status: 409 });
    }

    const newUser = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false,
    });

    await usersCollection.doc(newUser.uid).set({
      uid: newUser.uid,
      fullName,
      username,
      email,
      role,
      disabled: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ uid: newUser.uid }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Unable to create user." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, disabled } = body;

    if (!uid || typeof disabled !== "boolean") {
      return NextResponse.json({ message: "Invalid request payload." }, { status: 400 });
    }

    await adminAuth.updateUser(uid, { disabled });
    await usersCollection.doc(uid).update({ disabled, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    return NextResponse.json({ message: "User status updated." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "Unable to update user." }, { status: 500 });
  }
}
