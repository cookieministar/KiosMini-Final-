// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChS1qp7GrOaplZl9Dp6tRtOB0ptJZ72aQ",
  authDomain: "kiosmini-3962b.firebaseapp.com",
  projectId: "kiosmini-3962b",
  storageBucket: "kiosmini-3962b.appspot.com", // Diperbaiki dari firebasestorage.app
  messagingSenderId: "720791786781",
  appId: "1:720791786781:web:a0f17cf5f66be2411ebdf4",
  measurementId: "G-RLN8KXS5GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Fungsi login dengan Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

// Fungsi login dengan Facebook
export const signInWithFacebook = () => {
  return signInWithPopup(auth, facebookProvider);
};