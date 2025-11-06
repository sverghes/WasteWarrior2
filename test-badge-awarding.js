/**
 * Test script to verify badge awarding logic
 */

// Mock the badge calculation functions
const calculateBadges = (streak) => {
  // Only award badges on streaks divisible by 3
  if (streak < 3 || streak % 3 !== 0) {
    return {
      muffin: 0,
      coffee: 0,
      total: 0
    };
  }
  
  // Calculate how many milestones (multiples of 3) have been reached
  const milestones = Math.floor(streak / 3);
  
  // Alternate between muffin and coffee badges
  // Odd milestones (1st, 3rd, 5th...) = Muffin badges (streak 3, 9, 15...)
  // Even milestones (2nd, 4th, 6th...) = Coffee badges (streak 6, 12, 18...)
  const muffinBadges = Math.ceil(milestones / 2); // Round up for odd milestones
  const coffeeBadges = Math.floor(milestones / 2); // Round down for even milestones
  
  return {
    muffin: muffinBadges,
    coffee: coffeeBadges,
    total: muffinBadges + coffeeBadges
  };
};

// Test scenarios
console.log("=== Current Badge Awarding Logic ===");
console.log("Streak 0:", calculateBadges(0));
console.log("Streak 1:", calculateBadges(1));
console.log("Streak 2:", calculateBadges(2));
console.log("Streak 3:", calculateBadges(3)); // Should award 1 muffin
console.log("Streak 4:", calculateBadges(4));
console.log("Streak 5:", calculateBadges(5));
console.log("Streak 6:", calculateBadges(6)); // Should award 1 muffin + 1 coffee
console.log("Streak 9:", calculateBadges(9)); // Should award 2 muffin + 1 coffee
console.log("Streak 12:", calculateBadges(12)); // Should award 2 muffin + 2 coffee

console.log("\n=== Problem: User at streak 12 gets ALL badges at once ===");
console.log("A user who reaches streak 12 directly gets 2 muffin + 2 coffee badges");
console.log("But they should only get badges one at a time at streaks 3, 6, 9, and 12");

// Corrected logic - only award one badge at a time
const awardSingleBadge = (streak, existingBadgeCount = 0) => {
  // Only award badges on streaks divisible by 3
  if (streak < 3 || streak % 3 !== 0) {
    return {
      newBadge: null,
      totalBadges: existingBadgeCount
    };
  }
  
  // Calculate how many milestones should have been reached
  const milestones = Math.floor(streak / 3);
  
  // If user has fewer badges than milestones, award the next one
  if (existingBadgeCount < milestones) {
    const nextBadgeNumber = existingBadgeCount + 1;
    const badgeType = nextBadgeNumber % 2 === 1 ? 'muffin' : 'coffee';
    
    return {
      newBadge: {
        type: badgeType,
        number: nextBadgeNumber
      },
      totalBadges: existingBadgeCount + 1
    };
  }
  
  return {
    newBadge: null,
    totalBadges: existingBadgeCount
  };
};

console.log("\n=== Corrected Single Badge Awarding ===");
console.log("User with 0 badges at streak 3:", awardSingleBadge(3, 0));
console.log("User with 1 badge at streak 6:", awardSingleBadge(6, 1));
console.log("User with 2 badges at streak 9:", awardSingleBadge(9, 2));
console.log("User with 3 badges at streak 12:", awardSingleBadge(12, 3));
console.log("User with 0 badges at streak 12:", awardSingleBadge(12, 0), "← Only gets next badge");
