import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, where } from "firebase/firestore";
import styles from "../styles/LeaderboardPage.module.css";
import { calculateBadges, getDepartmentBadges, getBadgeSummary } from "../utils/badges";
import { getBadgeIdSummary } from "../utils/badgeCounters";

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
          Theatre: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } },
          Pathology: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } }
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
            
            // Calculate badges for this user
            const userBadges = calculateBadges(data.streak || 0);
            deptStats[data.department].badges.muffin += userBadges.muffin;
            deptStats[data.department].badges.coffee += userBadges.coffee;
            deptStats[data.department].badges.total += userBadges.total;
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
          Theatre: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } },
          Pathology: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } }
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

      {/* Department Cards */}
      <div className={styles.departmentCards}>
        {(() => {
          // Determine which department is leading
          const theatrePoints = departmentStats.Theatre?.totalPoints || 0;
          const pathologyPoints = departmentStats.Pathology?.totalPoints || 0;
          
          // Return cards in order based on who's leading, but always display side by side
          if (theatrePoints >= pathologyPoints) {
            // Theatre leading or tied - Theatre on left, Pathology on right
            return (
              <>
                <div className={styles.deptCard} data-department="theatre">
                  <div className={styles.deptHeader}>
                    <div className={styles.deptIcon}>🏥</div>
                    <div className={styles.deptTitle}>Theatre</div>
                    <div className={styles.deptRanking}>
                      {theatrePoints > pathologyPoints ? "🏆 Leading" : "🤝 Tied"}
                    </div>
                  </div>
                  
                  <div className={styles.deptStats}>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Total Points</span>
                      <span className={styles.deptStatValue}>{theatrePoints}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Active Warriors</span>
                      <span className={styles.deptStatValue}>{departmentStats.Theatre?.users || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Average Points</span>
                      <span className={styles.deptStatValue}>{departmentStats.Theatre?.avgPoints || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Team Badges</span>
                      <span className={styles.deptStatValue}>
                        {departmentStats.Theatre?.badges?.muffin || 0} 🧁 
                        {departmentStats.Theatre?.badges?.coffee || 0} ☕
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.deptCard} data-department="pathology">
                  <div className={styles.deptHeader}>
                    <div className={styles.deptIcon}>🔬</div>
                    <div className={styles.deptTitle}>Pathology</div>
                    <div className={styles.deptRanking}>
                      {pathologyPoints > theatrePoints ? "🏆 Leading" : 
                       pathologyPoints === theatrePoints ? "🤝 Tied" : "🥈 Second"}
                    </div>
                  </div>
                  
                  <div className={styles.deptStats}>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Total Points</span>
                      <span className={styles.deptStatValue}>{pathologyPoints}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Active Warriors</span>
                      <span className={styles.deptStatValue}>{departmentStats.Pathology?.users || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Average Points</span>
                      <span className={styles.deptStatValue}>{departmentStats.Pathology?.avgPoints || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Team Badges</span>
                      <span className={styles.deptStatValue}>
                        {departmentStats.Pathology?.badges?.muffin || 0} 🧁 
                        {departmentStats.Pathology?.badges?.coffee || 0} ☕
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          } else {
            // Pathology leading - Pathology on left, Theatre on right
            return (
              <>
                <div className={styles.deptCard} data-department="pathology">
                  <div className={styles.deptHeader}>
                    <div className={styles.deptIcon}>🔬</div>
                    <div className={styles.deptTitle}>Pathology</div>
                    <div className={styles.deptRanking}>🏆 Leading</div>
                  </div>
                  
                  <div className={styles.deptStats}>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Total Points</span>
                      <span className={styles.deptStatValue}>{pathologyPoints}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Active Warriors</span>
                      <span className={styles.deptStatValue}>{departmentStats.Pathology?.users || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Average Points</span>
                      <span className={styles.deptStatValue}>{departmentStats.Pathology?.avgPoints || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Team Badges</span>
                      <span className={styles.deptStatValue}>
                        {departmentStats.Pathology?.badges?.muffin || 0} 🧁 
                        {departmentStats.Pathology?.badges?.coffee || 0} ☕
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.deptCard} data-department="theatre">
                  <div className={styles.deptHeader}>
                    <div className={styles.deptIcon}>🏥</div>
                    <div className={styles.deptTitle}>Theatre</div>
                    <div className={styles.deptRanking}>🥈 Second</div>
                  </div>
                  
                  <div className={styles.deptStats}>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Total Points</span>
                      <span className={styles.deptStatValue}>{theatrePoints}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Active Warriors</span>
                      <span className={styles.deptStatValue}>{departmentStats.Theatre?.users || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Average Points</span>
                      <span className={styles.deptStatValue}>{departmentStats.Theatre?.avgPoints || 0}</span>
                    </div>
                    <div className={styles.deptStatRow}>
                      <span className={styles.deptStatLabel}>Team Badges</span>
                      <span className={styles.deptStatValue}>
                        {departmentStats.Theatre?.badges?.muffin || 0} 🧁 
                        {departmentStats.Theatre?.badges?.coffee || 0} ☕
                      </span>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })()}
      </div>

      {/* Filter Tabs - Compact */}
      <div className={styles.compactTabs}>
        <button 
          className={`${styles.compactTab} ${activeTab === "all" ? styles.activeCompactTab : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Warriors ({leaderboard.length})
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

      {/* Individual Warriors List */}
      <div className={styles.warriorsList}>
        {getFilteredLeaderboard().map((user, index) => (
          <div key={user.userId} className={styles.warriorRow}>
            <div className={styles.warriorRank}>
              #{activeTab === "all" ? user.rank : index + 1}
            </div>
            <div className={styles.warriorInfo}>
              <div className={styles.warriorName}>
                {getDepartmentIcon(user.department)} {user.name}
              </div>
              <div className={styles.warriorStats}>
                <span className={styles.warriorPoints}>{user.points} pts</span>
                <span className={styles.warriorStreak}>🔥 {user.streak}</span>
                <span className={styles.warriorBadges}>
                  {(() => {
                    const userBadges = calculateBadges(user.streak || 0);
                    return `${userBadges.muffin} 🧁 ${userBadges.coffee} ☕`;
                  })()}
                </span>
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
