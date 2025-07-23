// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBhkhr1A6fOEuM7Um4ld2qL6FloVCFj5Y",
  authDomain: "wastewarrior-healthcare.firebaseapp.com",
  projectId: "wastewarrior-healthcare",
  storageBucket: "wastewarrior-healthcare.firebasestorage.app",
  messagingSenderId: "618257929283",
  appId: "1:618257929283:web:240412ae2d664f82e0f0f6",
  measurementId: "G-DQJ3TPXQRV"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization error:", error);
  db = null;
}

// Initialize Cloud Firestore and get a reference to the service
export { db };
