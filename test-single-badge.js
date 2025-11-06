/**
 * Test script to verify the new single badge awarding logic
 */

// Simulate the new awardBadges logic
const awardBadges = (streak, existingBadgeIds = { muffin: [], coffee: [] }) => {
  const existingMuffinIds = existingBadgeIds.muffin || [];
  const existingCoffeeIds = existingBadgeIds.coffee || [];
  const totalExistingBadges = existingMuffinIds.length + existingCoffeeIds.length;
  
  const newMuffinIds = [...existingMuffinIds];
  const newCoffeeIds = [...existingCoffeeIds];
  
  // Only award badges on streaks divisible by 3
  if (streak < 3 || streak % 3 !== 0) {
    return {
      muffin: existingMuffinIds.length,
      coffee: existingCoffeeIds.length,
      total: totalExistingBadges,
      badgeIds: {
        muffin: newMuffinIds,
        coffee: newCoffeeIds
      },
      newBadgesAwarded: 0
    };
  }
  
  // Calculate how many milestones (multiples of 3) should have been reached
  const milestones = Math.floor(streak / 3);
  
  // If user has fewer badges than milestones, award only the next one
  if (totalExistingBadges < milestones) {
    const nextBadgeNumber = totalExistingBadges + 1;
    const badgeType = nextBadgeNumber % 2 === 1 ? 'muffin' : 'coffee';
    
    if (badgeType === 'muffin') {
      const muffinId = `MUF${String(newMuffinIds.length + 1).padStart(4, '0')}`;
      newMuffinIds.push(muffinId);
    } else {
      const coffeeId = `COF${String(newCoffeeIds.length + 1).padStart(4, '0')}`;
      newCoffeeIds.push(coffeeId);
    }
    
    return {
      muffin: newMuffinIds.length,
      coffee: newCoffeeIds.length,
      total: newMuffinIds.length + newCoffeeIds.length,
      badgeIds: {
        muffin: newMuffinIds,
        coffee: newCoffeeIds
      },
      newBadgesAwarded: 1
    };
  }
  
  // No new badges to award
  return {
    muffin: existingMuffinIds.length,
    coffee: existingCoffeeIds.length,
    total: totalExistingBadges,
    badgeIds: {
      muffin: newMuffinIds,
      coffee: newCoffeeIds
    },
    newBadgesAwarded: 0
  };
};

console.log("=== Testing New Single Badge Awarding Logic ===");

// Test scenario 1: New user progression
console.log("\n--- New User Progression ---");
let badgeIds = { muffin: [], coffee: [] };

console.log("Streak 0:", awardBadges(0, badgeIds));
console.log("Streak 1:", awardBadges(1, badgeIds));
console.log("Streak 2:", awardBadges(2, badgeIds));

// First badge at streak 3
let result = awardBadges(3, badgeIds);
console.log("Streak 3:", result);
badgeIds = result.badgeIds;

console.log("Streak 4:", awardBadges(4, badgeIds));
console.log("Streak 5:", awardBadges(5, badgeIds));

// Second badge at streak 6
result = awardBadges(6, badgeIds);
console.log("Streak 6:", result);
badgeIds = result.badgeIds;

console.log("Streak 7:", awardBadges(7, badgeIds));
console.log("Streak 8:", awardBadges(8, badgeIds));

// Third badge at streak 9
result = awardBadges(9, badgeIds);
console.log("Streak 9:", result);
badgeIds = result.badgeIds;

// Fourth badge at streak 12
result = awardBadges(12, badgeIds);
console.log("Streak 12:", result);
badgeIds = result.badgeIds;

// Test scenario 2: User who jumps to high streak (should only get next badge)
console.log("\n--- User Who Jumps to High Streak ---");
const noBadges = { muffin: [], coffee: [] };
console.log("User with no badges at streak 12:", awardBadges(12, noBadges));
console.log("^ Should only award 1 muffin badge, not all 4");

// Test scenario 3: User with some badges catching up
console.log("\n--- User Catching Up ---");
const someBadges = { muffin: ["MUF0001"], coffee: ["COF0001"] };
console.log("User with 2 badges at streak 12:", awardBadges(12, someBadges));
console.log("^ Should award 1 more muffin badge (the 3rd overall)");
