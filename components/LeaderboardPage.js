import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import styles from "../styles/LeaderboardPage.module.css";

const LeaderboardPage = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Try to connect to Firebase, but handle offline gracefully
    try {
      if (!db) {
        // Firebase not configured - use local storage only
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      // Listen to leaderboard changes
      const q = query(
        collection(db, "leaderboard"),
        orderBy("points", "desc"),
        limit(100)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaderboardData = [];
        const deptStats = {
          Theatre: { totalPoints: 0, users: 0, avgPoints: 0 },
          Pathology: { totalPoints: 0, users: 0, avgPoints: 0 }
        };
        
        let rank = 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          leaderboardData.push({
            ...data,
            rank: rank++
          });
          
          // Calculate department statistics
          if (deptStats[data.department]) {
            deptStats[data.department].totalPoints += data.points;
            deptStats[data.department].users += 1;
          }
        });
        
        // Calculate averages
        Object.keys(deptStats).forEach(dept => {
          if (deptStats[dept].users > 0) {
            deptStats[dept].avgPoints = Math.round(deptStats[dept].totalPoints / deptStats[dept].users);
          }
        });
        
        setLeaderboard(leaderboardData);
        setDepartmentStats(deptStats);
        setLoading(false);
      }, (error) => {
        console.log("Offline mode - showing local placeholder");
        // Show empty state for offline mode
        setLeaderboard([]);
        setDepartmentStats({
          Theatre: { totalPoints: 0, users: 0, avgPoints: 0 },
          Pathology: { totalPoints: 0, users: 0, avgPoints: 0 }
        });
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.log("Firebase not configured - using offline mode");
      setLeaderboard([]);
      setDepartmentStats({
        Theatre: { totalPoints: 0, users: 0, avgPoints: 0 },
        Pathology: { totalPoints: 0, users: 0, avgPoints: 0 }
      });
      setLoading(false);
    }
  }, []);

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

  const getFilteredLeaderboard = () => {
    if (activeTab === "all") return leaderboard;
    return leaderboard.filter(user => user.department === activeTab);
  };

  const getDepartmentRank = (department) => {
    const deptUsers = leaderboard.filter(user => user.department === department);
    if (deptUsers.length === 0) return "No users";
    
    const topUser = deptUsers[0];
    const overallRank = leaderboard.findIndex(user => user.userId === topUser.userId) + 1;
    return `#${overallRank} overall (${topUser.name})`;
  };

  if (loading) {
    return (
      <div className={styles.leaderboardPage}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            <img src="arrow-back.svg" alt="Back" />
          </button>
          <h1>🏆 Healthcare Heroes Leaderboard</h1>
          <p>Loading rankings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboardPage}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          <img src="arrow-back.svg" alt="Back" />
        </button>
        <h1>🏆 Leaderboard</h1>
      </div>

      {/* Compact Department Overview */}
      <div className={styles.compactOverview}>
        <div className={styles.overviewCard}>
          <div className={styles.overviewHeader}>
            <h3>Department Competition</h3>
            <div className={styles.totalWarriors}>{leaderboard.length} Warriors</div>
          </div>
          <div className={styles.departmentComparison}>
            <div className={styles.deptCard}>
              <span className={styles.deptIcon}>🏥</span>
              <div className={styles.deptInfo}>
                <div className={styles.deptName}>Theatre</div>
                <div className={styles.deptPoints}>{departmentStats.Theatre?.totalPoints || 0}pts</div>
              </div>
            </div>
            <div className={styles.vsIndicator}>VS</div>
            <div className={styles.deptCard}>
              <span className={styles.deptIcon}>🔬</span>
              <div className={styles.deptInfo}>
                <div className={styles.deptName}>Pathology</div>
                <div className={styles.deptPoints}>{departmentStats.Pathology?.totalPoints || 0}pts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs - Compact */}
      <div className={styles.compactTabs}>
        <button 
          className={`${styles.compactTab} ${activeTab === "all" ? styles.activeCompactTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All ({leaderboard.length})
        </button>
        <button 
          className={`${styles.compactTab} ${activeTab === "Theatre" ? styles.activeCompactTab : ""}`}
          onClick={() => setActiveTab("Theatre")}
        >
          🏥 Theatre ({leaderboard.filter(u => u.department === "Theatre").length})
        </button>
        <button 
          className={`${styles.compactTab} ${activeTab === "Pathology" ? styles.activeCompactTab : ""}`}
          onClick={() => setActiveTab("Pathology")}
        >
          🔬 Pathology ({leaderboard.filter(u => u.department === "Pathology").length})
        </button>
      </div>

      {/* Compact User Cards */}
      <div className={styles.userCardsContainer}>
        {getFilteredLeaderboard().map((user, index) => (
          <div key={user.userId} className={styles.userCard}>
            <div className={styles.cardRank}>
              #{activeTab === "all" ? user.rank : index + 1}
            </div>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{getDepartmentIcon(user.department)}</span>
                <span className={styles.cardName}>{user.name}</span>
                <span className={styles.cardBadge}>{getBadgeIcon(user.badges)}</span>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.points}</span>
                  <span className={styles.statLabel}>points</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.streak}</span>
                  <span className={styles.statLabel}>streak</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{user.badges}</span>
                  <span className={styles.statLabel}>badges</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredLeaderboard().length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏆</div>
          <p>No healthcare heroes yet!</p>
          <p>Start earning points by learning waste disposal guidelines.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
