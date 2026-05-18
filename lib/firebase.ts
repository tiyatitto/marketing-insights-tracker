import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzXivAMZ-DQSw2mHTD_fQlq-N4EwH7d5s",
    authDomain: "marketing-insights-tracker.firebaseapp.com",
    projectId: "marketing-insights-tracker",
    storageBucket: "marketing-insights-tracker.firebasestorage.app",
    messagingSenderId: "463912556829",
    appId: "1:463912556829:web:b402dc256888afe7f529f4",
    measurementId: "G-46TY7T6GJF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);