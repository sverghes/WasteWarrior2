import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { getUserWarriorId, formatWarriorName } from "../utils/warriorId";
import styles from "../styles/Leaderboard.module.css";

const Leaderboard = ({ userPoints, userStreak, userBadges, department }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Generate or retrieve warrior ID
    const initializeWarriorId = async () => {
      const warriorId = await getUserWarriorId(department);
      setUserId(warriorId);
    };
    
    if (department) {
      initializeWarriorId();
    }
  }, [department]);

  useEffect(() => {
    if (!userId) return;

    // Update user data in Firestore (graceful failure)
    const updateUserData = async () => {
      try {
        if (!db) {
          console.log("Firebase not configured - using local storage only");
          return;
        }
        
        const userRef = doc(db, "leaderboard", userId);
        const warriorName = formatWarriorName(userId, department);
        
        await setDoc(userRef, {
          userId: userId,
          name: warriorName,
          points: userPoints,
          streak: userStreak,
          badges: userBadges.length,
          department: department,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.log("Offline mode - leaderboard data will sync when online");
      }
    };

    updateUserData();
  }, [userId, userPoints, userStreak, userBadges, department]);

  useEffect(() => {
    if (!userId) return;

    try {
      if (!db) {
        console.log("Firebase not configured - showing local leaderboard");
        setLoading(false);
        return;
      }

      // Listen to leaderboard changes
      const q = query(
        collection(db, "leaderboard"),
        orderBy("points", "desc"),
        limit(50)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaderboardData = [];
        let rank = 1;
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            ...data,
            rank: rank++
          });
          
          if (data.userId === userId) {
            setUserRank(rank - 1);
          }
        });
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      }, (error) => {
        console.log("Offline mode - showing cached leaderboard");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.log("Firebase error - using offline mode");
      setLoading(false);
    }
  }, [userId]);

  const getDepartmentIcon = (dept) => {
    switch(dept) {
      case "Theatre": return "🏥";
      case "Pathology": return "🔬";
      default: return "🏥";
    }
  };

  const getBadgeIcon = (badgeCount) => {
    if (badgeCount >= 7) return "🏆";
    if (badgeCount >= 5) return "🥇";
    if (badgeCount >= 3) return "🥈";
    if (badgeCount >= 1) return "🥉";
    return "⭐";
  };

  if (loading) {
    return (
      <div className={styles.leaderboard}>
        <div className={styles.header}>
          <h2>🏆 Healthcare Heroes Leaderboard</h2>
          <p>Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboard}>
      <div className={styles.header}>
        <h2>🏆 Healthcare Heroes Leaderboard</h2>
        <p>Top waste warriors across all departments</p>
        {userRank && (
          <div className={styles.userRank}>
            Your rank: #{userRank} out of {leaderboard.length} warriors
          </div>
        )}
      </div>

      <div className={styles.topThree}>
        {leaderboard.slice(0, 3).map((user, index) => (
          <div key={user.userId} className={`${styles.podium} ${styles[`rank${index + 1}`]}`}>
            <div className={styles.podiumRank}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>
            <div className={styles.podiumName}>
              {getDepartmentIcon(user.department)} {user.name}
            </div>
            <div className={styles.podiumPoints}>{user.points} pts</div>
            <div className={styles.podiumBadges}>
              {getBadgeIcon(user.badges)} {user.badges} badges
            </div>
          </div>
        ))}
      </div>

      <div className={styles.fullList}>
        {leaderboard.slice(3).map((user) => (
          <div 
            key={user.userId} 
            className={`${styles.leaderboardRow} ${user.userId === userId ? styles.currentUser : ""}`}
          >
            <div className={styles.rank}>#{user.rank}</div>
            <div className={styles.userInfo}>
              <div className={styles.name}>
                {getDepartmentIcon(user.department)} {user.name}
              </div>
              <div className={styles.stats}>
                <span className={styles.points}>{user.points} points</span>
                <span className={styles.streak}>🔥 {user.streak} streak</span>
                <span className={styles.badges}>{getBadgeIcon(user.badges)} {user.badges}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className={styles.empty}>
          <p>Be the first healthcare hero on the leaderboard!</p>
          <p>Start earning points by learning waste disposal guidelines.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
