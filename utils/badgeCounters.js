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
 * Awards badges and generates secure IDs for them
 * @param {number} streak - Current streak count
 * @param {array} existingBadgeIds - Array of existing badge IDs for this user
 * @returns {Promise<object>} - Object with badge counts and new badge IDs
 */
export const awardBadges = async (streak, existingBadgeIds = []) => {
  const currentBadges = calculateBadgeCount(streak);
  const existingMuffinIds = existingBadgeIds.filter(id => id.startsWith('MUF'));
  const existingCoffeeIds = existingBadgeIds.filter(id => id.startsWith('COF'));
  
  const newBadgeIds = [...existingBadgeIds];
  
  // Award new muffin badges
  const muffinsToAward = currentBadges.muffin - existingMuffinIds.length;
  for (let i = 0; i < muffinsToAward; i++) {
    const muffinId = await generateBadgeId('muffin');
    newBadgeIds.push(muffinId);
  }
  
  // Award new coffee badges
  const coffeesToAward = currentBadges.coffee - existingCoffeeIds.length;
  for (let i = 0; i < coffeesToAward; i++) {
    const coffeeId = await generateBadgeId('coffee');
    newBadgeIds.push(coffeeId);
  }
  
  return {
    muffin: currentBadges.muffin,
    coffee: currentBadges.coffee,
    total: currentBadges.total,
    badgeIds: newBadgeIds,
    newBadgesAwarded: muffinsToAward + coffeesToAward
  };
};

/**
 * Calculate badges based on streak count (internal helper)
 * @param {number} streak - Current streak count
 * @returns {object} - Object with muffin and coffee badge counts
 */
const calculateBadgeCount = (streak) => {
  const muffinBadges = streak > 0 ? Math.floor(streak / 1) : 0;
  const coffeeBadges = streak >= 3 ? Math.floor(streak / 3) : 0;
  
  return {
    muffin: muffinBadges,
    coffee: coffeeBadges,
    total: muffinBadges + coffeeBadges
  };
};

/**
 * Get badge display summary with latest badge IDs
 * @param {array} badgeIds - Array of badge IDs for this user
 * @returns {string} - Summary text with latest badge IDs
 */
export const getBadgeIdSummary = (badgeIds = []) => {
  const muffinIds = badgeIds.filter(id => id.startsWith('MUF'));
  const coffeeIds = badgeIds.filter(id => id.startsWith('COF'));
  
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
    const userBadgeIds = user.badgeIds || [];
    allMuffinIds = allMuffinIds.concat(userBadgeIds.filter(id => id.startsWith('MUF')));
    allCoffeeIds = allCoffeeIds.concat(userBadgeIds.filter(id => id.startsWith('COF')));
  });
  
  return {
    muffin: allMuffinIds.length,
    coffee: allCoffeeIds.length,
    total: allMuffinIds.length + allCoffeeIds.length,
    muffinIds: allMuffinIds,
    coffeeIds: allCoffeeIds
  };
};
