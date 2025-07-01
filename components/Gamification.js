import React, { useState, useEffect } from "react";
import styles from "./../styles/Gamification.module.css";

const Gamification = ({ onPointsUpdate }) => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [level, setLevel] = useState(1);
  const [showAchievement, setShowAchievement] = useState(null);

  // Badge definitions
  const badgeDefinitions = [
    { id: 'waste_warrior', name: 'Waste Warrior', description: '100 correct classifications', icon: '🏥', requirement: 100 },
    { id: 'sharp_shooter', name: 'Sharp Shooter', description: '50 sharps correctly identified', icon: '🎯', requirement: 50 },
    { id: 'pathology_pro', name: 'Pathology Pro', description: '25 pathology specimens classified', icon: '🔬', requirement: 25 },
    { id: 'safety_first', name: 'Safety First', description: 'Perfect score on PPE requirements', icon: '🛡️', requirement: 1 },
    { id: 'speed_demon', name: 'Speed Demon', description: '20 rapid classifications in a row', icon: '⚡', requirement: 20 },
    { id: 'mentor', name: 'Mentor', description: 'Help 10 colleagues improve', icon: '📚', requirement: 10 }
  ];

  useEffect(() => {
    // Load saved data
    if (typeof window !== "undefined") {
      const savedPoints = localStorage.getItem('ww_points');
      const savedStreak = localStorage.getItem('ww_streak');
      const savedBadges = localStorage.getItem('ww_badges');
      const savedLevel = localStorage.getItem('ww_level');

      if (savedPoints) setPoints(parseInt(savedPoints));
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedBadges) setBadges(JSON.parse(savedBadges));
      if (savedLevel) setLevel(parseInt(savedLevel));
    }
  }, []);

  const addPoints = (amount, category = null) => {
    const newPoints = points + amount;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    setPoints(newPoints);
    
    // Check for level up
    if (newLevel > level) {
      setLevel(newLevel);
      showAchievementToast(`Level Up! You're now level ${newLevel}`, '🎉');
    }
    
    // Save to localStorage
    localStorage.setItem('ww_points', newPoints.toString());
    localStorage.setItem('ww_level', newLevel.toString());
    
    if (onPointsUpdate) {
      onPointsUpdate(newPoints, newLevel);
    }
  };

  const incrementStreak = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem('ww_streak', newStreak.toString());
    
    // Streak bonus
    if (newStreak % 5 === 0) {
      addPoints(newStreak, 'streak_bonus');
      showAchievementToast(`${newStreak} Classification Streak! Bonus points earned!`, '🔥');
    }
  };

  const resetStreak = () => {
    setStreak(0);
    localStorage.setItem('ww_streak', '0');
  };

  const unlockBadge = (badgeId) => {
    const badge = badgeDefinitions.find(b => b.id === badgeId);
    if (badge && !badges.find(b => b.id === badgeId)) {
      const newBadges = [...badges, badge];
      setBadges(newBadges);
      localStorage.setItem('ww_badges', JSON.stringify(newBadges));
      showAchievementToast(`Badge Unlocked: ${badge.name}!`, badge.icon);
      addPoints(50); // Badge bonus
    }
  };

  const showAchievementToast = (message, icon) => {
    setShowAchievement({ message, icon });
    setTimeout(() => setShowAchievement(null), 3000);
  };

  const checkBadgeProgress = (action, count = 1) => {
    switch (action) {
      case 'correct_classification':
        if (points >= 1000 && !badges.find(b => b.id === 'waste_warrior')) {
          unlockBadge('waste_warrior');
        }
        break;
      case 'sharps_identified':
        // Track sharps specifically - this would need to be implemented in the prediction logic
        break;
      case 'pathology_classified':
        // Track pathology specimens - this would need to be implemented in the prediction logic
        break;
      default:
        break;
    }
  };

  // Expose functions for use by other components
  window.gamification = {
    addPoints,
    incrementStreak,
    resetStreak,
    unlockBadge,
    checkBadgeProgress
  };

  return (
    <>
      {showAchievement && (
        <div className={styles.achievementToast}>
          <span className={styles.achievementIcon}>{showAchievement.icon}</span>
          <span className={styles.achievementMessage}>{showAchievement.message}</span>
        </div>
      )}
    </>
  );
};

export default Gamification;
