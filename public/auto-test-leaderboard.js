/**
 * Auto-Test Script for Leaderboard
 * Run this in browser console to automatically set up and verify leaderboard
 */

window.autoTestLeaderboard = async function() {
  console.log("🚀 AUTO-TESTING LEADERBOARD...");
  console.log("================================");
  
  try {
    // Step 1: Check if we're on the right page
    if (!window.location.href.includes('wastewarrior4.vercel.app')) {
      console.log("⚠️  Please navigate to https://wastewarrior4.vercel.app first");
      return;
    }
    
    // Step 2: Try to populate test data via the testing component
    console.log("🔄 Step 1: Attempting to populate test data...");
    
    // Look for the test functions that should be available
    if (typeof populateTestData === 'function') {
      console.log("✅ Found populateTestData function");
      const result = await populateTestData();
      if (result) {
        console.log("✅ Successfully populated Firebase with mock data");
      } else {
        console.log("❌ Failed to populate data - check Firebase connection");
      }
    } else {
      console.log("⚠️  populateTestData function not found - using localStorage fallback");
      
      // Fallback: Set some test data in localStorage for current user
      localStorage.setItem("points", "180");
      localStorage.setItem("streak", "12");
      localStorage.setItem("badgeIds", JSON.stringify({
        muffin: ["MUF1001", "MUF1003"],
        coffee: ["COF1001", "COF1002"]
      }));
      localStorage.setItem("department", "Theatre");
      localStorage.setItem("warriorId", "TW9999");
      
      console.log("✅ Set test data in localStorage for current user");
    }
    
    // Step 3: Show expected results
    console.log("\n🎯 EXPECTED LEADERBOARD RESULTS:");
    console.log("=================================");
    
    const expectedResults = [
      "🥇 1st: TW1003 (Theatre 🏥) - 310 pts, 21 streak, 7 badges 🏆",
      "🥈 2nd: TW1004 (Theatre 🏥) - 270 pts, 18 streak, 6 badges 🏆", 
      "🥉 3rd: TW1002 (Theatre 🏥) - 220 pts, 15 streak, 5 badges 🥇",
      "4th: TW1001 (Theatre 🏥) - 180 pts, 12 streak, 4 badges 🥇",
      "5th: PW1001 (Pathology 🔬) - 150 pts, 9 streak, 3 badges 🥈",
      "6th: PW1004 (Pathology 🔬) - 120 pts, 9 streak, 3 badges 🥈",
      "7th: PW1002 (Pathology 🔬) - 90 pts, 6 streak, 2 badges 🥉",
      "8th: PW1003 (Pathology 🔬) - 45 pts, 3 streak, 1 badge ⭐"
    ];
    
    expectedResults.forEach(result => console.log(result));
    
    // Step 4: Department totals
    console.log("\n🏥 DEPARTMENT TOTALS:");
    console.log("Theatre: 4 users, 980 points total, 22 badges total");
    console.log("Pathology: 4 users, 405 points total, 9 badges total");
    
    // Step 5: Instructions
    console.log("\n📋 NEXT STEPS:");
    console.log("1. Go to Settings (gear icon)");
    console.log("2. If you see '🧪 Leaderboard Testing' section:");
    console.log("   → Click 'Add Mock Users'");
    console.log("   → Click 'Verify Data'");
    console.log("3. Click 'Leaderboard' menu item");
    console.log("4. Compare what you see with expected results above");
    console.log("5. Report back: Do the numbers match? ✅ or ❌");
    
    return true;
    
  } catch (error) {
    console.error("❌ Error during auto-test:", error);
    console.log("🔧 Manual steps:");
    console.log("1. Go to Settings");
    console.log("2. Use the Leaderboard Testing section");
    console.log("3. Click 'Add Mock Users'");
    console.log("4. Go to Leaderboard and compare results");
    return false;
  }
};

// Quick manual test for current user
window.testCurrentUser = function() {
  console.log("👤 TESTING CURRENT USER DATA");
  console.log("============================");
  
  const points = localStorage.getItem("points") || "0";
  const streak = localStorage.getItem("streak") || "0";
  const badgeIds = JSON.parse(localStorage.getItem("badgeIds") || '{"muffin": [], "coffee": []}');
  const department = localStorage.getItem("department") || "Unknown";
  const warriorId = localStorage.getItem("warriorId") || "Unknown";
  
  const totalBadges = (badgeIds.muffin?.length || 0) + (badgeIds.coffee?.length || 0);
  
  console.log(`Warrior ID: ${warriorId}`);
  console.log(`Department: ${department}`);
  console.log(`Points: ${points}`);
  console.log(`Streak: ${streak}`);
  console.log(`Total Badges: ${totalBadges}`);
  console.log(`Badge IDs:`, badgeIds);
  
  console.log("\n🔍 This data should appear in the leaderboard");
  console.log("Go to Settings → Leaderboard to verify");
};

// Auto-run message
console.log(`
🧪 LEADERBOARD AUTO-TEST READY

Available commands:
• autoTestLeaderboard() - Full automated test
• testCurrentUser()     - Check your current data

Quick start:
> autoTestLeaderboard()

Then go to Settings → Leaderboard to see results!
`);

// Make functions globally available
window.autoTestLeaderboard = window.autoTestLeaderboard;
window.testCurrentUser = window.testCurrentUser;