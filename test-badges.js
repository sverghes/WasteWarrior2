// Quick test to verify badge calculation logic
const calculateBadges = (streak) => {
  // Coffee badges: awarded every 3 streaks (streak 3, 6, 9, etc.)
  const coffeeBadges = streak >= 3 ? Math.floor(streak / 3) : 0;
  
  // Muffin badges: awarded for streaks that are NOT divisible by 3 (streak 1, 2, 4, 5, 7, 8, etc.)
  const muffinBadges = streak > 0 ? streak - coffeeBadges : 0;
  
  return {
    muffin: muffinBadges,
    coffee: coffeeBadges,
    total: muffinBadges + coffeeBadges
  };
};

console.log("Badge Calculation Test:");
console.log("======================");

for (let streak = 1; streak <= 9; streak++) {
  const badges = calculateBadges(streak);
  console.log(`Streak ${streak}: Muffin=${badges.muffin}, Coffee=${badges.coffee}, Total=${badges.total} ${badges.total === streak ? '✅' : '❌'}`);
}
