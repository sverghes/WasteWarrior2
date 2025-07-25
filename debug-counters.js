// Debug script to check current counter values
// Run this in browser console to see counter states

import { db } from "./firebase/firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

async function checkCounters() {
  try {
    const theatreCounter = await getDoc(doc(db, "counters", "theatreWarriors"));
    const pathologyCounter = await getDoc(doc(db, "counters", "pathologyWarriors"));
    
    console.log("Theatre Counter:", theatreCounter.exists() ? theatreCounter.data() : "Not exists");
    console.log("Pathology Counter:", pathologyCounter.exists() ? pathologyCounter.data() : "Not exists");
  } catch (error) {
    console.error("Error checking counters:", error);
  }
}

checkCounters();
