// Database cleanup utility for WasteWarrior
// This script will delete all existing users from the leaderboard collection
// and reset the counters for a fresh start with the new warrior ID system

import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";

/**
 * Deletes all documents from the leaderboard collection
 */
export const clearLeaderboard = async () => {
  try {
    if (!db) {
      console.log("Firebase not configured - cannot clear database");
      return false;
    }

    console.log("🗑️ Starting leaderboard cleanup...");
    
    // Get all documents in the leaderboard collection
    const leaderboardRef = collection(db, "leaderboard");
    const snapshot = await getDocs(leaderboardRef);
    
    console.log(`Found ${snapshot.size} users to delete`);
    
    // Delete each document
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log("✅ All leaderboard entries deleted successfully");
    return true;
    
  } catch (error) {
    console.error("❌ Error clearing leaderboard:", error);
    return false;
  }
};

/**
 * Resets the warrior ID counters to start fresh
 */
export const resetCounters = async () => {
  try {
    if (!db) {
      console.log("Firebase not configured - cannot reset counters");
      return false;
    }

    console.log("🔄 Resetting warrior ID counters...");
    
    // Reset Theatre counter
    await setDoc(doc(db, "counters", "theatreWarriors"), {
      count: 1000, // Start from 1000 so first ID is TW1001
      department: "Theatre",
      resetAt: new Date().toISOString()
    });
    
    // Reset Pathology counter
    await setDoc(doc(db, "counters", "pathologyWarriors"), {
      count: 1000, // Start from 1000 so first ID is PW1001
      department: "Pathology", 
      resetAt: new Date().toISOString()
    });
    
    console.log("✅ Counters reset successfully");
    console.log("Next IDs will be: TW1001 and PW1001");
    return true;
    
  } catch (error) {
    console.error("❌ Error resetting counters:", error);
    return false;
  }
};

/**
 * Complete database reset - clears leaderboard and resets counters
 */
export const resetDatabase = async () => {
  console.log("🚀 Starting complete database reset...");
  
  const leaderboardCleared = await clearLeaderboard();
  const countersReset = await resetCounters();
  
  if (leaderboardCleared && countersReset) {
    console.log("🎉 Database reset completed successfully!");
    console.log("All users have been deleted and counters reset.");
    console.log("New users will get IDs starting from TW1001 and PW1001");
    return true;
  } else {
    console.log("⚠️ Database reset partially failed - check errors above");
    return false;
  }
};

// Export for use in browser console or components
if (typeof window !== 'undefined') {
  window.resetDatabase = resetDatabase;
  window.clearLeaderboard = clearLeaderboard;
  window.resetCounters = resetCounters;
}
