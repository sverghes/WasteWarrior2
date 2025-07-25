/**
 * Badge utility functions for WasteWarrior gamification
 */

/**
 * Calculate badges based on streak count
 * @param {number} streak - Current streak count
 * @returns {object} - Object with muffin and coffee badge counts
 */
export const calculateBadges = (streak) => {
  const muffinBadges = streak > 0 ? Math.floor(streak / 1) : 0; // Every streak earns a muffin
  const coffeeBadges = streak >= 3 ? Math.floor(streak / 3) : 0; // Every 3 streaks earns a coffee
  
  return {
    muffin: muffinBadges,
    coffee: coffeeBadges,
    total: muffinBadges + coffeeBadges
  };
};

/**
 * Get badge display information
 * @param {number} muffinCount - Number of muffin badges
 * @param {number} coffeeCount - Number of coffee badges
 * @returns {array} - Array of badge objects for display
 */
export const getBadgeDisplay = (muffinCount, coffeeCount) => {
  const badges = [];
  
  // Add muffin badges
  for (let i = 0; i < muffinCount; i++) {
    badges.push({
      type: 'muffin',
      image: '/muffin.svg',
      alt: 'Muffin Badge',
      title: 'Streak Badge'
    });
  }
  
  // Add coffee badges
  for (let i = 0; i < coffeeCount; i++) {
    badges.push({
      type: 'coffee',
      image: '/coffee.svg',
      alt: 'Coffee Badge',
      title: '3+ Streak Badge'
    });
  }
  
  return badges;
};

/**
 * Get badge summary text
 * @param {number} muffinCount - Number of muffin badges
 * @param {number} coffeeCount - Number of coffee badges
 * @returns {string} - Summary text for badges
 */
export const getBadgeSummary = (muffinCount, coffeeCount) => {
  const parts = [];
  
  if (muffinCount > 0) {
    parts.push(`${muffinCount} 🧁`);
  }
  
  if (coffeeCount > 0) {
    parts.push(`${coffeeCount} ☕`);
  }
  
  return parts.length > 0 ? parts.join(' ') : '0 badges';
};

/**
 * Get department badge totals from leaderboard data
 * @param {array} leaderboardData - Array of user data
 * @param {string} department - Department name
 * @returns {object} - Department badge totals
 */
export const getDepartmentBadges = (leaderboardData, department) => {
  const departmentUsers = leaderboardData.filter(user => user.department === department);
  
  let totalMuffins = 0;
  let totalCoffee = 0;
  
  departmentUsers.forEach(user => {
    const badges = calculateBadges(user.streak || 0);
    totalMuffins += badges.muffin;
    totalCoffee += badges.coffee;
  });
  
  return {
    muffin: totalMuffins,
    coffee: totalCoffee,
    total: totalMuffins + totalCoffee
  };
};
