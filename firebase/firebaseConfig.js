// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Note: Replace with your actual Firebase config for cloud features
const firebaseConfig = {
  apiKey: "demo-key-please-replace-with-actual",
  authDomain: "wastewarrior-healthcare.firebaseapp.com",
  projectId: "wastewarrior-healthcare",
  storageBucket: "wastewarrior-healthcare.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase not configured properly - app will run in offline mode");
  db = null;
}

// Initialize Cloud Firestore and get a reference to the service
export { db };
