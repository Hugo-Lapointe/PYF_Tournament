// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwYXmgV-Ljh0D9dpjohRdJ7q083HjZ288",
  authDomain: "tournamentapp-d4671.firebaseapp.com",
  projectId: "tournamentapp-d4671",
  storageBucket: "tournamentapp-d4671.firebasestorage.app",
  messagingSenderId: "1064386528497",
  appId: "1:1064386528497:web:f66686ed7305631d419550",
  measurementId: "G-WYE63DKD05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Firestore exports
export const auth = getAuth(app);
const analytics = getAnalytics(app);