import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// --- এই ৩টা লাইন খুব খেয়াল করে দেখুন ---
export const auth = getAuth(app); // ১. auth তৈরি করে সাথে সাথে এক্সপোর্ট
export const db = getFirestore(app); // ২. db তৈরি করে সাথে সাথে এক্সপোর্ট
export const googleProvider = new GoogleAuthProvider(); // ৩. এটিও এক্সপোর্ট