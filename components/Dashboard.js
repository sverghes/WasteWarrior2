import React, { useEffect, useState } from "react";
import styles from "./../styles/Dashboard.module.css";
import HowTo from "./HowTo";
import DepartmentSelector from "./DepartmentSelector";
import { calculateBadges, getBadgeDisplay } from "../utils/badges";
import { awardBadges, getBadgeIdSummary } from "../utils/badgeCounters";

const Dashboard = (props) => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);
  const [badgeIds, setBadgeIds] = useState({ muffin: [], coffee: [] });
  const [dailyProgress, setDailyProgress] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [department, setDepartment] = useState("");
  const [showDepartmentSelector, setShowDepartmentSelector] = useState(false);

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
      if (localStorage.getItem("badgeIds") != null) {
        const savedBadgeIds = JSON.parse(localStorage.getItem("badgeIds"));
        // Ensure the saved data has the correct structure
        setBadgeIds({
          muffin: savedBadgeIds?.muffin || [],
          coffee: savedBadgeIds?.coffee || []
        });
      }
      
      // Load department preference
      const savedDepartment = localStorage.getItem("department");
      if (savedDepartment) {
        setDepartment(savedDepartment);
      } else {
        setShowDepartmentSelector(true);
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

  // Calculate current badges based on streak
  const currentBadges = calculateBadges(streak);
  const badgeDisplay = getBadgeDisplay(currentBadges.muffin, currentBadges.coffee);

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
    
    // Update streak if it changed and award new badges
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");
    if (currentStreak !== streak) {
      setStreak(currentStreak);
      updateBadgeIds(currentStreak);
    }
  };

  const updateBadgeIds = async (newStreak) => {
    try {
      const badgeResult = await awardBadges(newStreak, badgeIds);
      if (badgeResult.newBadgesAwarded > 0) {
        setBadgeIds(badgeResult.badgeIds);
        localStorage.setItem("badgeIds", JSON.stringify(badgeResult.badgeIds));
      }
    } catch (error) {
      console.log("Error updating badge IDs:", error);
    }
  };

  const handleDepartmentSelect = (selectedDepartment) => {
    setDepartment(selectedDepartment);
    setShowDepartmentSelector(false);
  };

  return (
    <div className={styles.dashboard}>
      {showDepartmentSelector && (
        <DepartmentSelector onDepartmentSelect={handleDepartmentSelect} />
      )}
      
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
          <div className={styles.statValue}>{currentBadges.total}</div>
          <div className={styles.statLabel}>
            {badgeIds.muffin.length > 0 || badgeIds.coffee.length > 0 ? (
              <div className={styles.badgeIdDisplay}>
                {badgeIds.muffin.length > 0 && (
                  <span className={styles.badgeId}>
                    {badgeIds.muffin[badgeIds.muffin.length - 1]}
                  </span>
                )}
                {badgeIds.coffee.length > 0 && (
                  <span className={styles.badgeId}>
                    {badgeIds.coffee[badgeIds.coffee.length - 1]}
                  </span>
                )}
              </div>
            ) : (
              "Badges"
            )}
          </div>
          <div className={styles.badgeDisplay}>
            {badgeDisplay.slice(0, 6).map((badge, index) => (
              <img 
                key={index} 
                src={badge.image} 
                alt={badge.alt} 
                title={badge.title}
                className={styles.badgeIcon}
              />
            ))}
            {badgeDisplay.length > 6 && (
              <span className={styles.badgeMore}>+{badgeDisplay.length - 6}</span>
            )}
          </div>
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
