/**
 * Simple Browser Console Test for Leaderboard
 * Copy and paste this into browser console to test leaderboard manually
 */

// Quick test function you can run in browser console
window.testLeaderboard = async function() {
  console.log("🧪 Starting Leaderboard Test...");
  
  // Mock Firebase if not available
  if (typeof firebase === 'undefined') {
    console.log("⚠️ Firebase not loaded - creating mock test");
    
    // Create mock data in localStorage for testing
    const mockLeaderboardData = [
      { name: "TW1001", department: "Theatre", points: 180, streak: 12, badges: 4 },
      { name: "PW1001", department: "Pathology", points: 150, streak: 9, badges: 3 },
      { name: "TW1002", department: "Theatre", points: 220, streak: 15, badges: 5 },
      { name: "PW1002", department: "Pathology", points: 90, streak: 6, badges: 2 },
      { name: "TW1003", department: "Theatre", points: 310, streak: 21, badges: 7 }
    ];
    
    localStorage.setItem("mockLeaderboard", JSON.stringify(mockLeaderboardData));
    console.log("📊 Mock leaderboard data created in localStorage");
    console.log("Data:", mockLeaderboardData);
    
    return mockLeaderboardData;
  }
  
  // If Firebase is available, use the real test functions
  try {
    if (window.populateTestData) {
      await window.populateTestData();
      console.log("✅ Real Firebase test data populated");
    } else {
      console.log("⚠️ Test functions not loaded - try refreshing page");
    }
  } catch (error) {
    console.error("❌ Error running Firebase test:", error);
  }
};

// Quick points test
window.testPoints = function() {
  console.log("🎯 Testing points system...");
  
  const currentPoints = parseInt(localStorage.getItem("points") || "0");
  const testPoints = currentPoints + 50;
  
  localStorage.setItem("points", testPoints.toString());
  console.log(`📈 Points updated: ${currentPoints} → ${testPoints}`);
  
  // Trigger a page refresh or component update
  window.location.reload();
};

// Quick streak test
window.testStreak = function() {
  console.log("🔥 Testing streak system...");
  
  const currentStreak = parseInt(localStorage.getItem("streak") || "0");
  const testStreak = 6; // Multiple of 3 - should award badges
  
  localStorage.setItem("streak", testStreak.toString());
  console.log(`🔥 Streak updated: ${currentStreak} → ${testStreak}`);
  
  // Update badge IDs for streak 6 (should have 2 badges)
  const testBadgeIds = {
    muffin: ["MUF9999"],
    coffee: ["COF9999"]
  };
  localStorage.setItem("badgeIds", JSON.stringify(testBadgeIds));
  console.log("🏆 Test badges added:", testBadgeIds);
  
  window.location.reload();
};

// Clear test data
window.clearTestData = function() {
  console.log("🧹 Clearing test data...");
  
  localStorage.removeItem("mockLeaderboard");
  localStorage.setItem("points", "0");
  localStorage.setItem("streak", "0");
  localStorage.setItem("badgeIds", '{"muffin": [], "coffee": []}');
  
  console.log("✅ Test data cleared");
  window.location.reload();
};

console.log(`
🧪 LEADERBOARD TESTING CONSOLE COMMANDS

Available test functions:
• testLeaderboard()  - Create mock leaderboard data
• testPoints()       - Add 50 test points
• testStreak()       - Set streak to 6 with test badges  
• clearTestData()    - Reset all test data

Usage:
1. Run testLeaderboard() to populate data
2. Go to Settings → Leaderboard to check results
3. Try testPoints() or testStreak() to test updates
4. Use clearTestData() when done

Example:
> testLeaderboard()
> testPoints()
`);

// Auto-run basic setup
if (typeof window !== 'undefined') {
  console.log("🎮 Leaderboard test utilities loaded!");
}