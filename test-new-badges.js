// Test the new alternating badge system
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

console.log("New Alternating Badge System Test:");
console.log("==================================");

for (let streak = 1; streak <= 18; streak++) {
  const badges = calculateBadges(streak);
  const badgeType = streak % 3 === 0 ? (Math.floor(streak / 3) % 2 === 1 ? 'MUFFIN' : 'COFFEE') : 'NONE';
  console.log(`Streak ${streak.toString().padStart(2)}: Muffin=${badges.muffin}, Coffee=${badges.coffee}, Total=${badges.total} | Award: ${badgeType}`);
}
