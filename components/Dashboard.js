import React, { useEffect, useState } from "react";
import styles from "./../styles/Dashboard.module.css";
import HowTo from "./HowTo";

const Dashboard = (props) => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load gamification data
      if (localStorage.getItem("points") != null) {
        setPoints(parseInt(localStorage.getItem("points")));
      }
      if (localStorage.getItem("streak") != null) {
        setStreak(parseInt(localStorage.getItem("streak")));
      }
      if (localStorage.getItem("badges") != null) {
        setBadges(JSON.parse(localStorage.getItem("badges")));
      }
      
      // Load daily progress
      const savedClickCount = parseInt(localStorage.getItem("dailyClickCount") || "0");
      const savedCooldownEnd = localStorage.getItem("cooldownEndTime");
      
      setDailyProgress(savedClickCount);
      
      if (savedCooldownEnd) {
        const endTime = parseInt(savedCooldownEnd);
        const now = Date.now();
        setIsOnCooldown(now < endTime);
      }
    }
  }, []);

  const handlePointsUpdate = (newPoints) => {
    setPoints(newPoints);
    
    // Update daily progress and cooldown status
    const savedClickCount = parseInt(localStorage.getItem("dailyClickCount") || "0");
    const savedCooldownEnd = localStorage.getItem("cooldownEndTime");
    
    setDailyProgress(savedClickCount);
    
    if (savedCooldownEnd) {
      const endTime = parseInt(savedCooldownEnd);
      const now = Date.now();
      setIsOnCooldown(now < endTime);
    }
    
    // Update streak if it changed
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");
    if (currentStreak !== streak) {
      setStreak(currentStreak);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Gamification Stats */}
      <div className={styles.gamificationStats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{points}</div>
          <div className={styles.statLabel}>Points</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{streak}</div>
          <div className={styles.statLabel}>Streak</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{badges.length}</div>
          <div className={styles.statLabel}>Badges</div>
        </div>
      </div>
      <div className={styles.nav}>
        <div className={styles.header}>Healthcare Dashboard</div>
        <div className={styles.right}>
          <img
            src="settings.svg"
            onClick={() => props.setSettings(true)}
            className={styles.settings}
          />
        </div>
      </div>
      {props.num > 0 && (
        <div className={styles.callout} onClick={() => props.setView(true)}>
          <img src="decoration.svg" />
          <div className={styles.pretitle}>You classified</div>
          <div className={styles.title}>
            {props.num} medical waste item{props.num > 1 && "s"}
          </div>
          <div className={styles.subtitle}>Keep up the great work! 🏥</div>
        </div>
      )}
      
      {/* Daily Challenge Section */}
      <div className={styles.challengeSection}>
        <div className={styles.challengeHeader}>
          <img src="2question.svg" />
          <span>Daily Challenge</span>
        </div>
        <div className={styles.challengeCard}>
          <div className={styles.challengeTitle}>Click 3 disposal guide items</div>
          <div className={styles.challengeReward}>
            {isOnCooldown ? "🎉 Streak earned! Wait for next round" : "Reward: +1 Streak 🔥"}
          </div>
          <div className={styles.challengeProgress}>
            Progress: {dailyProgress}/3 {isOnCooldown && "- Cooldown active"}
          </div>
        </div>
      </div>
      <HowTo onPointsUpdate={handlePointsUpdate} />
      <div className={styles.button} onClick={() => props.setView(true)}>
        <img src="scanmore.svg" />
        Scan medical waste
      </div>
    </div>
  );
};

export default Dashboard;
