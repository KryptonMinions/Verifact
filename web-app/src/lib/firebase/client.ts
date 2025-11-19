import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDrsPtoPLHmRDfPQZ3xlmrwBFzXP9DXr5M",
    authDomain: "agent-builder-472216.firebaseapp.com",
    projectId: "agent-builder-472216",
    storageBucket: "agent-builder-472216.firebasestorage.app",
    messagingSenderId: "737726244243",
    appId: "1:737726244243:web:61570da297404124113466",
    measurementId: "G-8HHL64ZF8H"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
// Initialize with the specific database ID
const db = getFirestore(app, "misinfo-reports");

// Sign in anonymously for read permissions
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign-in failed:", error.code, error.message);
});

export { auth, db };
