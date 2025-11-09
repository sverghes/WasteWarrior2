/**
 * Leaderboard Test Utility - Creates mock data for testing
 * Use this to populate Firebase with test users and verify leaderboard functionality
 */

import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";

/**
 * Mock user data for testing leaderboard
 */
const mockUsers = [
  {
    userId: "TW1001",
    name: "TW1001",
    department: "Theatre",
    points: 180,
    streak: 12,
    badges: 4,
    badgeIds: {
      muffin: ["MUF1001", "MUF1003"],
      coffee: ["COF1001", "COF1002"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "PW1001", 
    name: "PW1001",
    department: "Pathology",
    points: 150,
    streak: 9,
    badges: 3,
    badgeIds: {
      muffin: ["MUF1004", "MUF1006"],
      coffee: ["COF1003"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "TW1002",
    name: "TW1002", 
    department: "Theatre",
    points: 220,
    streak: 15,
    badges: 5,
    badgeIds: {
      muffin: ["MUF1007", "MUF1009", "MUF1011"],
      coffee: ["COF1004", "COF1005"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "PW1002",
    name: "PW1002",
    department: "Pathology", 
    points: 90,
    streak: 6,
    badges: 2,
    badgeIds: {
      muffin: ["MUF1012"],
      coffee: ["COF1006"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "TW1003",
    name: "TW1003",
    department: "Theatre",
    points: 310,
    streak: 21,
    badges: 7,
    badgeIds: {
      muffin: ["MUF1013", "MUF1015", "MUF1017", "MUF1019"],
      coffee: ["COF1007", "COF1008", "COF1009"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "PW1003",
    name: "PW1003", 
    department: "Pathology",
    points: 45,
    streak: 3,
    badges: 1,
    badgeIds: {
      muffin: ["MUF1020"],
      coffee: []
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "TW1004",
    name: "TW1004",
    department: "Theatre",
    points: 270,
    streak: 18,
    badges: 6,
    badgeIds: {
      muffin: ["MUF1021", "MUF1023", "MUF1025"],
      coffee: ["COF1010", "COF1011", "COF1012"]
    },
    lastUpdated: new Date().toISOString()
  },
  {
    userId: "PW1004",
    name: "PW1004",
    department: "Pathology",
    points: 120,
    streak: 9,
    badges: 3,
    badgeIds: {
      muffin: ["MUF1026", "MUF1028"],
      coffee: ["COF1013"]
    },
    lastUpdated: new Date().toISOString()
  }
];

/**
 * Populate Firebase with mock leaderboard data
 */
export const populateTestData = async () => {
  try {
    if (!db) {
      console.error("Firebase not configured - cannot populate test data");
      return false;
    }

    console.log("🔄 Populating Firebase with mock leaderboard data...");
    
    for (const user of mockUsers) {
      const userRef = doc(db, "leaderboard", user.userId);
      await setDoc(userRef, user, { merge: true });
      console.log(`✅ Added test user: ${user.name} (${user.department}) - ${user.points} points`);
    }
    
    console.log("🎉 Successfully populated Firebase with", mockUsers.length, "test users");
    console.log("📊 Test data includes:");
    console.log("   • Theatre users:", mockUsers.filter(u => u.department === "Theatre").length);
    console.log("   • Pathology users:", mockUsers.filter(u => u.department === "Pathology").length);
    console.log("   • Points range: 45-310");
    console.log("   • Streak range: 3-21");
    console.log("   • Badge range: 1-7");
    
    return true;
  } catch (error) {
    console.error("❌ Error populating test data:", error);
    return false;
  }
};

/**
 * Clear all test data from Firebase
 */
export const clearTestData = async () => {
  try {
    if (!db) {
      console.error("Firebase not configured - cannot clear test data");
      return false;
    }

    console.log("🔄 Clearing test data from Firebase...");
    
    const leaderboardRef = collection(db, "leaderboard");
    const snapshot = await getDocs(leaderboardRef);
    
    const deletePromises = [];
    snapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    
    console.log("🧹 Successfully cleared", deletePromises.length, "test users from Firebase");
    return true;
  } catch (error) {
    console.error("❌ Error clearing test data:", error);
    return false;
  }
};

/**
 * Add your current user to the test data with realistic progress
 */
export const addCurrentUserTestData = async (department = "Theatre") => {
  try {
    if (!db) {
      console.error("Firebase not configured - cannot add test user data");
      return false;
    }

    const testUserData = {
      userId: department === "Theatre" ? "TW9999" : "PW9999",
      name: department === "Theatre" ? "TW9999" : "PW9999", 
      department: department,
      points: 75, // Moderate progress
      streak: 6,  // Multiple of 3 - should have 2 badges
      badges: 2,
      badgeIds: {
        muffin: ["MUF9999"], // First badge at streak 3
        coffee: ["COF9999"]  // Second badge at streak 6
      },
      lastUpdated: new Date().toISOString()
    };

    const userRef = doc(db, "leaderboard", testUserData.userId);
    await setDoc(userRef, testUserData, { merge: true });
    
    console.log("🎯 Added your test user:", testUserData.name);
    console.log("   • Department:", testUserData.department);
    console.log("   • Points:", testUserData.points);
    console.log("   • Streak:", testUserData.streak);
    console.log("   • Badges:", testUserData.badges, "- MUF9999, COF9999");
    
    return true;
  } catch (error) {
    console.error("❌ Error adding current user test data:", error);
    return false;
  }
};

/**
 * Quick test to verify leaderboard data structure
 */
export const verifyLeaderboardData = async () => {
  try {
    if (!db) {
      console.error("Firebase not configured - cannot verify data");
      return false;
    }

    console.log("🔍 Verifying leaderboard data...");
    
    const leaderboardRef = collection(db, "leaderboard");
    const snapshot = await getDocs(leaderboardRef);
    
    if (snapshot.empty) {
      console.log("📭 No leaderboard data found");
      return false;
    }
    
    console.log("📊 Found", snapshot.size, "users in leaderboard:");
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const badgeCount = (data.badgeIds?.muffin?.length || 0) + (data.badgeIds?.coffee?.length || 0);
      console.log(`   • ${data.name} (${data.department}): ${data.points}pts, ${data.streak} streak, ${badgeCount} badges`);
    });
    
    return true;
  } catch (error) {
    console.error("❌ Error verifying leaderboard data:", error);
    return false;
  }
};

// Usage instructions for browser console:
console.log(`
🧪 LEADERBOARD TEST UTILITIES

To use these functions in browser console:

1. Populate test data:
   > populateTestData()

2. Add yourself as test user:
   > addCurrentUserTestData("Theatre")  // or "Pathology"

3. Verify data was added:
   > verifyLeaderboardData()

4. Clear all test data:
   > clearTestData()

Then check Settings → Leaderboard to see the results!
`);