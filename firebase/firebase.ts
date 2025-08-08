// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD0jw0zA_4MeEMVpJDfAprlZmhuJLDaxg",
  authDomain: "winner-5c54a.firebaseapp.com",
  projectId: "winner-5c54a",
  storageBucket: "winner-5c54a.firebasestorage.app",
  messagingSenderId: "255499982718",
  appId: "1:255499982718:web:a1f1291dd505f1a91bc52f",
  measurementId: "G-8CBN8BSZ2L",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);

// Only initialize analytics on the client side
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
