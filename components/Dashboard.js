import React, { useEffect, useState } from "react";
import styles from "./../styles/Dashboard.module.css";
import HowTo from "./HowTo";

const Dashboard = (props) => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState([]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          url: "https://ecosnap.vercel.app",
          text: "Learn how to manage medical waste with WasteWarrior Healthcare",
          title: "WasteWarrior Healthcare",
        })
        .then(function () {
          console.log("Successful share");
        })
        .catch(function (error) {
          window.open(
            "https://twitter.com/intent/tweet?text=Check%20out%20WasteWarrior%20Healthcare%20to%20manage%20medical%20waste%20better%20with%20AI&url=http%3A%2F%2Fecosnap.vercel.app",
            "_blank"
          );
        });
    } else {
      window.open(
        "https://twitter.com/intent/tweet?text=Check%20out%20WasteWarrior%20Healthcare%20to%20manage%20medical%20waste%20better%20with%20AI&url=http%3A%2F%2Fecosnap.vercel.app",
        "_blank"
      );
    }
  };

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
    }
  }, []);

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
          <img
            onClick={() => handleShare()}
            className={styles.help}
            src="share.svg"
          />
        </div>
      </div>
      {props.num > 0 ? (
        <div className={styles.callout} onClick={() => props.setView(true)}>
          <img src="decoration.svg" />
          <div className={styles.pretitle}>You classified</div>
          <div className={styles.title}>
            {props.num} medical waste item{props.num > 1 && "s"}
          </div>
          <div className={styles.subtitle}>Keep up the great work! 🏥</div>
        </div>
      ) : (
        <div className={styles.callout} onClick={() => props.setView(true)}>
          <img src="decoration.svg" />
          <div className={styles.pretitle}>Start learning</div>
          <div className={styles.title}>Scan medical waste</div>
          <div className={styles.subtitle}>Earn points and improve safety! 🎯</div>
        </div>
      )}
      
      {/* Daily Challenge Section */}
      <div className={styles.challengeSection}>
        <div className={styles.challengeHeader}>
          <img src="2question.svg" />
          <span>Daily Challenge</span>
        </div>
        <div className={styles.challengeCard}>
          <div className={styles.challengeTitle}>Identify 5 sharps containers correctly</div>
          <div className={styles.challengeReward}>Reward: 50 bonus points 🎯</div>
          <div className={styles.challengeProgress}>Progress: 0/5</div>
        </div>
      </div>
      <HowTo />
      <div className={styles.button} onClick={() => props.setView(true)}>
        <img src="scanmore.svg" />
        Scan medical waste
      </div>
    </div>
  );
};

export default Dashboard;
