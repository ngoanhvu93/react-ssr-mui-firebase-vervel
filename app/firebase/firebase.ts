// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMeimN-6F5mSZwiOntOzSrrcm_1u5i8FY",
  authDomain: "appvn-bd7f0.firebaseapp.com",
  projectId: "appvn-bd7f0",
  storageBucket: "appvn-bd7f0.firebasestorage.app",
  messagingSenderId: "931421879534",
  appId: "1:931421879534:web:00b745178eb2d1621047ff",
  measurementId: "G-X87SDW687W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
