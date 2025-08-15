// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwYXmgV-Ljh0D9dpjohRdJ7q083HjZ288",
  authDomain: "tournamentapp-d4671.firebaseapp.com",
  projectId: "tournamentapp-d4671",
  storageBucket: "tournamentapp-d4671.appspot.com", // ⚠ Fix the storage bucket URL
  messagingSenderId: "1064386528497",
  appId: "1:1064386528497:web:f66686ed7305631d419550",
  measurementId: "G-WYE63DKD05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const analytics = getAnalytics(app);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ Export storage
