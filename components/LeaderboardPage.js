import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import styles from "../styles/LeaderboardPage.module.css";

// Normalize department names so stats stay consistent even if data casing differs
const normalizeDepartment = (value) => {
  if (!value) {
    return null;
  }

  const normalized = value.toString().trim().toLowerCase();

  if (normalized.startsWith("theatre")) {
    return "Theatre";
  }

  if (normalized.startsWith("pathology")) {
    return "Pathology";
  }

  return null;
};

// Ensure we always work with number types regardless of how Firestore stored the value
const toNumber = (value) => {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

// Guarantee badge IDs follow the { muffin: [], coffee: [] } structure
const normalizeBadgeIds = (rawBadgeIds) => {
  if (!rawBadgeIds || typeof rawBadgeIds !== "object") {
    return { muffin: [], coffee: [] };
  }

  const muffin = Array.isArray(rawBadgeIds.muffin) ? rawBadgeIds.muffin : [];
  const coffee = Array.isArray(rawBadgeIds.coffee) ? rawBadgeIds.coffee : [];

  return { muffin, coffee };
};

const LeaderboardPage = ({ onBack }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Ensure current user is synced to leaderboard
  const ensureCurrentUserSynced = async () => {
    try {
      const storedUserId = localStorage.getItem("warriorId");
      const storedDepartment = localStorage.getItem("department");
      
      if (!storedUserId || !storedDepartment || !db) {
        return;
      }

      const userRef = doc(db, "leaderboard", storedUserId);
      const userDoc = await getDoc(userRef);
      
      // If user doesn't exist in leaderboard, create them
      if (!userDoc.exists()) {
        // Get current local data
        const currentPoints = parseInt(localStorage.getItem("points")) || 0;
        const currentStreak = parseInt(localStorage.getItem("streak")) || 0;
        const badgeIds = JSON.parse(localStorage.getItem("badgeIds") || '{"muffin":[],"coffee":[]}');
        const totalBadges = (badgeIds.muffin || []).length + (badgeIds.coffee || []).length;
        
        await setDoc(userRef, {
          userId: storedUserId,
          name: storedUserId,
          points: currentPoints,
          streak: currentStreak,
          badges: totalBadges,
          badgeIds: badgeIds,
          department: storedDepartment,
          lastUpdated: new Date().toISOString()
        });
        
        console.log("🎯 Current user synced to leaderboard:", storedUserId);
      }
    } catch (error) {
      console.log("Could not sync current user:", error.message);
    }
  };

  useEffect(() => {
    // Ensure current user is synced to leaderboard
    ensureCurrentUserSynced();
    
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
        console.log("📊 Leaderboard: Received", querySnapshot.size, "documents from Firebase");
        
        const leaderboardData = [];
        const deptStats = {
          Theatre: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } },
          Pathology: { totalPoints: 0, users: 0, avgPoints: 0, badges: { muffin: 0, coffee: 0, total: 0 } }
        };
        
        let rank = 1;
        querySnapshot.forEach((docSnapshot) => {
          const rawData = docSnapshot.data();
          const normalizedDepartment = normalizeDepartment(rawData.department);

          if (!normalizedDepartment || !deptStats[normalizedDepartment]) {
            console.warn("⚠️ Skipping user with unexpected department:", rawData.department, rawData.userId);
            return;
          }

          const points = toNumber(rawData.points);
          const streak = toNumber(rawData.streak);
          const badgeIds = normalizeBadgeIds(rawData.badgeIds);
          const muffinCount = badgeIds.muffin.length;
          const coffeeCount = badgeIds.coffee.length;
          const totalBadges = muffinCount + coffeeCount;

          const badgeCounts = {
            muffin: muffinCount,
            coffee: coffeeCount,
            total: totalBadges
          };

          const leaderboardEntry = {
            ...rawData,
            department: normalizedDepartment,
            points,
            streak,
            badges: typeof rawData.badges === "number" ? rawData.badges : totalBadges,
            badgeIds,
            badgeCounts,
            rank: rank++
          };

          console.log(
            "👤 Processing user:",
            leaderboardEntry.name || leaderboardEntry.userId,
            "Department:",
            normalizedDepartment,
            "Points:",
            points
          );

          leaderboardData.push(leaderboardEntry);
          
          // Calculate department statistics with normalized data
          deptStats[normalizedDepartment].totalPoints += points;
          deptStats[normalizedDepartment].users += 1;
          deptStats[normalizedDepartment].badges.muffin += muffinCount;
          deptStats[normalizedDepartment].badges.coffee += coffeeCount;
          deptStats[normalizedDepartment].badges.total += totalBadges;

          console.log(
            `📈 ${normalizedDepartment} stats: ${deptStats[normalizedDepartment].users} users, ${deptStats[normalizedDepartment].totalPoints} points, ${deptStats[normalizedDepartment].badges.total} badges`
          );
        });
        
        // Calculate averages
        Object.keys(deptStats).forEach(dept => {
          if (deptStats[dept].users > 0) {
            deptStats[dept].avgPoints = Math.round(deptStats[dept].totalPoints / deptStats[dept].users);
          }
        });
        
        console.log("📊 Final department stats:", deptStats);
        console.log("👥 Final leaderboard:", leaderboardData.length, "users");
        
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
                    const muffin = user.badgeCounts?.muffin ?? user.badgeIds?.muffin?.length ?? 0;
                    const coffee = user.badgeCounts?.coffee ?? user.badgeIds?.coffee?.length ?? 0;
                    return `${muffin} 🧁 ${coffee} ☕`;
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
