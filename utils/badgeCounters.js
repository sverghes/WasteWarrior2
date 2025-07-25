import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";

/**
 * Generates a unique badge ID in the format MUF#### or COF#### based on badge type
 * @param {string} badgeType - "muffin" or "coffee"
 * @returns {Promise<string>} - Generated badge ID
 */
export const generateBadgeId = async (badgeType) => {
  const prefix = badgeType === "muffin" ? "MUF" : "COF";
  
  try {
    if (!db) {
      // Fallback for offline mode - use random 4-digit number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `${prefix}${randomNum}`;
    }

    // Reference to the counter document for this badge type
    const counterRef = doc(db, "counters", `${badgeType}Badges`);
    
    // Get current counter value
    const counterDoc = await getDoc(counterRef);
    
    let nextNumber;
    if (counterDoc.exists()) {
      // Get the current count before incrementing
      const currentCount = counterDoc.data().count;
      nextNumber = currentCount + 1;
      
      // Increment the counter
      await updateDoc(counterRef, {
        count: increment(1)
      });
    } else {
      // Initialize counter if it doesn't exist
      nextNumber = 1001; // Start from 1001 to ensure 4-digit format
      await setDoc(counterRef, {
        count: nextNumber,
        badgeType: badgeType,
        createdAt: new Date().toISOString()
      });
    }
    
    // Format as 4-digit number (pad with zeros if needed)
    const formattedNumber = nextNumber.toString().padStart(4, '0');
    return `${prefix}${formattedNumber}`;
    
  } catch (error) {
    console.log("Error generating badge ID, using fallback:", error);
    // Fallback to random number if Firebase fails
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNum}`;
  }
};

/**
 * Award badges based on streak and existing badge IDs (ONE AT A TIME)
 * @param {number} streak - Current streak count
 * @param {object} existingBadgeIds - Object with muffin and coffee arrays of badge IDs
 * @returns {Promise<object>} - Object with badge counts and new badge IDs
 */
export const awardBadges = async (streak, existingBadgeIds = { muffin: [], coffee: [] }) => {
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
      const muffinId = await generateBadgeId('muffin');
      newMuffinIds.push(muffinId);
    } else {
      const coffeeId = await generateBadgeId('coffee');
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

/**
 * Get badge display summary with latest badge IDs
 * @param {object} badgeIds - Object with muffin and coffee arrays of badge IDs
 * @returns {string} - Summary text with latest badge IDs
 */
export const getBadgeIdSummary = (badgeIds = { muffin: [], coffee: [] }) => {
  const muffinIds = badgeIds.muffin || [];
  const coffeeIds = badgeIds.coffee || [];
  
  if (muffinIds.length === 0 && coffeeIds.length === 0) {
    return 'No badges';
  }
  
  const parts = [];
  
  if (muffinIds.length > 0) {
    const latestMuffin = muffinIds[muffinIds.length - 1];
    if (muffinIds.length === 1) {
      parts.push(latestMuffin);
    } else {
      parts.push(`${latestMuffin} (+${muffinIds.length - 1})`);
    }
  }
  
  if (coffeeIds.length > 0) {
    const latestCoffee = coffeeIds[coffeeIds.length - 1];
    if (coffeeIds.length === 1) {
      parts.push(latestCoffee);
    } else {
      parts.push(`${latestCoffee} (+${coffeeIds.length - 1})`);
    }
  }
  
  return parts.join(' ');
};

/**
 * Get department badge ID totals from leaderboard data
 * @param {array} leaderboardData - Array of user data
 * @param {string} department - Department name
 * @returns {object} - Department badge ID totals
 */
export const getDepartmentBadgeIds = (leaderboardData, department) => {
  const departmentUsers = leaderboardData.filter(user => user.department === department);
  
  let allMuffinIds = [];
  let allCoffeeIds = [];
  
  departmentUsers.forEach(user => {
    const userBadgeIds = user.badgeIds || { muffin: [], coffee: [] };
    allMuffinIds = allMuffinIds.concat(userBadgeIds.muffin || []);
    allCoffeeIds = allCoffeeIds.concat(userBadgeIds.coffee || []);
  });
  
  return {
    muffin: allMuffinIds.length,
    coffee: allCoffeeIds.length,
    total: allMuffinIds.length + allCoffeeIds.length,
    muffinIds: allMuffinIds,
    coffeeIds: allCoffeeIds
  };
};
