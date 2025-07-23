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
      console.log("Offline mode - showing cached leaderboard");
      // Show local storage data for offline mode
      const localData = JSON.parse(localStorage.getItem("leaderboardCache") || "[]");
      setLeaderboard(localData);
      setLoading(false);
    });

    return () => unsubscribe();
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
        <h1>🏆 Healthcare Heroes Leaderboard</h1>
        <p>Competition across Theatre and Pathology departments</p>
      </div>

      {/* Department Statistics */}
      <div className={styles.departmentStats}>
        <h2>📊 Department Performance</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🏥</div>
            <div className={styles.statInfo}>
              <h3>Theatre Department</h3>
              <div className={styles.statNumbers}>
                <span className={styles.totalPoints}>{departmentStats.Theatre?.totalPoints || 0} total points</span>
                <span className={styles.userCount}>{departmentStats.Theatre?.users || 0} active warriors</span>
                <span className={styles.avgPoints}>{departmentStats.Theatre?.avgPoints || 0} avg points</span>
                <span className={styles.topRank}>Top performer: {getDepartmentRank("Theatre")}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔬</div>
            <div className={styles.statInfo}>
              <h3>Pathology Department</h3>
              <div className={styles.statNumbers}>
                <span className={styles.totalPoints}>{departmentStats.Pathology?.totalPoints || 0} total points</span>
                <span className={styles.userCount}>{departmentStats.Pathology?.users || 0} active warriors</span>
                <span className={styles.avgPoints}>{departmentStats.Pathology?.avgPoints || 0} avg points</span>
                <span className={styles.topRank}>Top performer: {getDepartmentRank("Pathology")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Winner */}
      {departmentStats.Theatre && departmentStats.Pathology && (
        <div className={styles.departmentWinner}>
          <h3>🏆 Leading Department</h3>
          <div className={styles.winner}>
            {departmentStats.Theatre.totalPoints > departmentStats.Pathology.totalPoints ? (
              <div className={styles.winnerCard}>
                <span className={styles.winnerIcon}>🏥</span>
                <span className={styles.winnerText}>Theatre Department leads with {departmentStats.Theatre.totalPoints} points!</span>
              </div>
            ) : departmentStats.Pathology.totalPoints > departmentStats.Theatre.totalPoints ? (
              <div className={styles.winnerCard}>
                <span className={styles.winnerIcon}>🔬</span>
                <span className={styles.winnerText}>Pathology Department leads with {departmentStats.Pathology.totalPoints} points!</span>
              </div>
            ) : (
              <div className={styles.winnerCard}>
                <span className={styles.winnerIcon}>🤝</span>
                <span className={styles.winnerText}>It's a tie! Both departments are equally committed to safety!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        <button 
          className={`${styles.tab} ${activeTab === "all" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Warriors ({leaderboard.length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "Theatre" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("Theatre")}
        >
          🏥 Theatre ({leaderboard.filter(u => u.department === "Theatre").length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "Pathology" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("Pathology")}
        >
          🔬 Pathology ({leaderboard.filter(u => u.department === "Pathology").length})
        </button>
      </div>

      {/* Leaderboard List */}
      <div className={styles.leaderboardList}>
        {getFilteredLeaderboard().map((user, index) => (
          <div key={user.userId} className={styles.leaderboardRow}>
            <div className={styles.rank}>
              {activeTab === "all" ? `#${user.rank}` : `#${index + 1}`}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.name}>
                {getDepartmentIcon(user.department)} {user.name}
              </div>
              <div className={styles.stats}>
                <span className={styles.points}>{user.points} points</span>
                <span className={styles.streak}>🔥 {user.streak} streak</span>
                <span className={styles.badges}>{getBadgeIcon(user.badges)} {user.badges} badges</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {getFilteredLeaderboard().length === 0 && (
        <div className={styles.empty}>
          <p>No healthcare heroes in this category yet!</p>
          <p>Start earning points by learning waste disposal guidelines.</p>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
