import React, { useEffect, useState } from "react";
import styles from "./../styles/HowTo.module.css";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getUserWarriorId, formatWarriorName } from "../utils/warriorId";

const HowTo = (props) => {
  const [searchField, setSearchField] = useState("");
  const [coinAnimations, setCoinAnimations] = useState([]);
  const [clickedItems, setClickedItems] = useState(new Set());
  const [dailyClickCount, setDailyClickCount] = useState(0);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownEndTime, setCooldownEndTime] = useState(null);
  const [showStreakMessage, setShowStreakMessage] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const items = [
    {
      name: "Red Bag - Infectious Waste",
      description: "Autoclave before disposal",
      url: "#",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "infectious",
      points: 10
    },
    {
      name: "Yellow Bag - Clinical Waste",
      description: "Incineration required",
      url: "#",
      image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "clinical",
      points: 10
    },
    {
      name: "Sharps Container",
      description: "Sealed and incinerated",
      url: "#",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "sharps",
      points: 15
    },
    {
      name: "Blue/White Bag - Pharmaceuticals",
      description: "High-temperature incineration",
      url: "#",
      image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "pharmaceutical",
      points: 12
    },
    {
      name: "Black Bag - Non-hazardous",
      description: "Standard waste disposal",
      url: "#",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "non-hazardous",
      points: 5
    },
    {
      name: "Purple/Yellow - Cytotoxic",
      description: "Specialized incineration",
      url: "#",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "cytotoxic",
      points: 20
    },
    {
      name: "Surgical Instruments",
      description: "Sterilize and reprocess",
      url: "#",
      image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "instruments",
      points: 8
    },
    {
      name: "Pathology Specimens",
      description: "Yellow bag - incineration",
      url: "#",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "pathology",
      points: 15
    },
    {
      name: "Contaminated PPE",
      description: "Red bag - autoclave/incinerate",
      url: "#",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "ppe",
      points: 10
    },
    {
      name: "Laboratory Glass",
      description: "Sharps container if broken",
      url: "#",
      image: "https://images.unsplash.com/photo-1518187685704-f9ca63550471?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "glass",
      points: 12
    },
    {
      name: "Dialysis Equipment",
      description: "Red bag - infectious waste",
      url: "#",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "dialysis",
      points: 15
    },
    {
      name: "Chemotherapy Containers",
      description: "Purple bag - cytotoxic waste",
      url: "#",
      image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      category: "chemo",
      points: 20
    }
  ];

  // Function to sync user data to Firebase leaderboard
  const syncToFirebase = async (points, streak, badgeIds) => {
    try {
      if (!db) {
        console.log("Firebase not configured - using local storage only");
        return;
      }

      // Get or generate warrior ID
      const department = localStorage.getItem("department") || "Theatre";
      const userId = await getUserWarriorId(department);
      
      const userRef = doc(db, "leaderboard", userId);
      const warriorName = formatWarriorName(userId, department);
      
      // Calculate total badges from badgeIds
      const totalBadges = (badgeIds.muffin || []).length + (badgeIds.coffee || []).length;
      
      await setDoc(userRef, {
        userId: userId,
        name: warriorName,
        points: points,
        streak: streak,
        badges: totalBadges,
        badgeIds: badgeIds, // Store the full badge ID structure
        department: department,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      
      console.log("Successfully synced to Firebase leaderboard");
    } catch (error) {
      console.log("Offline mode - leaderboard data will sync when online");
    }
  };

  useEffect(() => {
    // Initialize state from localStorage
    const savedClickCount = parseInt(localStorage.getItem("dailyClickCount") || "0");
    const savedCooldownEnd = localStorage.getItem("cooldownEndTime");
    const savedClickedItems = localStorage.getItem("dailyClickedItems");
    
    setDailyClickCount(savedClickCount);
    
    if (savedClickedItems) {
      try {
        const parsedItems = JSON.parse(savedClickedItems);
        setClickedItems(new Set(parsedItems));
      } catch (e) {
        console.error("Error parsing clicked items:", e);
      }
    }
    
    if (savedCooldownEnd) {
      const endTime = parseInt(savedCooldownEnd);
      const now = Date.now();
      
      if (now < endTime) {
        setIsOnCooldown(true);
        setCooldownEndTime(endTime);
        setTimeRemaining(Math.ceil((endTime - now) / 1000));
      } else {
        // Cooldown expired, reset daily progress
        localStorage.removeItem("cooldownEndTime");
        localStorage.removeItem("dailyClickCount");
        localStorage.removeItem("dailyClickedItems");
        setDailyClickCount(0);
        setClickedItems(new Set());
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    if (isOnCooldown && cooldownEndTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((cooldownEndTime - now) / 1000);
        
        if (remaining <= 0) {
          // Cooldown finished
          setIsOnCooldown(false);
          setCooldownEndTime(null);
          setTimeRemaining(0);
          setDailyClickCount(0);
          setClickedItems(new Set());
          
          // Clear localStorage
          localStorage.removeItem("cooldownEndTime");
          localStorage.removeItem("dailyClickCount");
          localStorage.removeItem("dailyClickedItems");
        } else {
          setTimeRemaining(remaining);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnCooldown, cooldownEndTime]);

  const createConfetti = () => {
    const pieces = [];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: Math.random(),
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: Math.random() * 3,
        animationDuration: 2 + Math.random() * 2
      });
    }
    
    setConfettiPieces(pieces);
    
    setTimeout(() => {
      setConfettiPieces([]);
    }, 5000);
  };

  const filteredItems = items.filter((item) => {
    return (
      item.name.toLowerCase().includes(searchField.toLowerCase()) ||
      item.description.toLowerCase().includes(searchField.toLowerCase())
    );
  });

  const handleChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleItemClick = (e, item, index) => {
    e.preventDefault();
    
    // Don't allow clicks during cooldown
    if (isOnCooldown) {
      return;
    }
    
    // Don't add points if already clicked in this session
    if (clickedItems.has(index)) {
      return;
    }

    // Add to clicked items
    const newClickedItems = new Set([...clickedItems, index]);
    setClickedItems(newClickedItems);
    
    // Increment daily click count
    const newDailyCount = dailyClickCount + 1;
    setDailyClickCount(newDailyCount);
    
    // Save to localStorage
    localStorage.setItem("dailyClickCount", newDailyCount.toString());
    localStorage.setItem("dailyClickedItems", JSON.stringify([...newClickedItems]));
    
    // Get click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create coin animation
    const coinId = Date.now() + Math.random();
    const newCoin = {
      id: coinId,
      x: x,
      y: y,
      points: item.points
    };
    
    setCoinAnimations(prev => [...prev, newCoin]);
    
    // Update points in localStorage
    const currentPoints = parseInt(localStorage.getItem("points") || "0");
    const newPoints = currentPoints + item.points;
    localStorage.setItem("points", newPoints.toString());
    
    // Get current badges for Firebase sync (using new badgeIds system)
    const badgeIds = JSON.parse(localStorage.getItem("badgeIds") || '{"muffin": [], "coffee": []}');
    
    // Sync to Firebase leaderboard
    const currentStreak = parseInt(localStorage.getItem("streak") || "0");
    syncToFirebase(newPoints, currentStreak, badgeIds);
    
    // Remove coin animation after animation completes
    setTimeout(() => {
      setCoinAnimations(prev => prev.filter(coin => coin.id !== coinId));
    }, 2000);

    // Check if we've reached 3 clicks (streak achieved)
    if (newDailyCount === 3) {
      // Increment streak
      const currentStreak = parseInt(localStorage.getItem("streak") || "0");
      const newStreak = currentStreak + 1;
      localStorage.setItem("streak", newStreak.toString());
      
      // Sync updated streak to Firebase (using new badgeIds system)
      const badgeIds = JSON.parse(localStorage.getItem("badgeIds") || '{"muffin": [], "coffee": []}');
      syncToFirebase(newPoints, newStreak, badgeIds);
      
      // Show confetti and streak message
      createConfetti();
      setShowStreakMessage(true);
      
      setTimeout(() => {
        setShowStreakMessage(false);
      }, 3000);
      
      // Start 5-minute cooldown
      const cooldownEnd = Date.now() + (5 * 60 * 1000); // 5 minutes
      setCooldownEndTime(cooldownEnd);
      setIsOnCooldown(true);
      setTimeRemaining(300); // 5 minutes in seconds
      localStorage.setItem("cooldownEndTime", cooldownEnd.toString());
      
      // Trigger dashboard update
      if (props.onPointsUpdate) {
        props.onPointsUpdate(newPoints);
      }
    } else {
      // Trigger page refresh to update dashboard points
      if (props.onPointsUpdate) {
        props.onPointsUpdate(newPoints);
      }
    }
    
    // Check if all items are clicked (sync current state to Firebase)
    if (newClickedItems.size === items.length) {
      // Sync current state to Firebase (guide completion doesn't award badges in new system)
      const badgeIds = JSON.parse(localStorage.getItem("badgeIds") || '{"muffin": [], "coffee": []}');
      const currentPoints = parseInt(localStorage.getItem("points") || "0");
      const currentStreak = parseInt(localStorage.getItem("streak") || "0");
      syncToFirebase(currentPoints, currentStreak, badgeIds);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.howto}>
      <div className={styles.title}>Medical Waste Disposal Guide</div>
      <div className={styles.input}>
        <img src="search.svg" alt="Search" className={styles.search} />
        {searchField.length > 0 && (
          <img
            src="searchclear.svg"
            alt="Clear search"
            onClick={() => setSearchField("")}
            className={styles.clear}
          />
        )}
        <input
          placeholder="Search for medical waste item"
          value={searchField}
          onChange={handleChange}
        />
      </div>
      <div className={styles.results}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, i) => (
            <div
              className={`${styles.result} ${clickedItems.has(i) ? styles.clicked : ''}`}
              key={i}
              onClick={(e) => handleItemClick(e, item, i)}
              style={{ position: 'relative' }}
            >
              <div
                className={styles.image}
                style={{ backgroundImage: "url(" + item.image + ")" }}
              ></div>
              <div className={styles.info}>
                <div className={styles.name}>{item.name}</div>
                <div className={styles.desc}>{item.description}</div>
                {item.points && (
                  <div className={`${styles.points} ${clickedItems.has(i) ? styles.pointsEarned : ''}`}>
                    {clickedItems.has(i) ? '✓ Earned' : `+${item.points} points`}
                  </div>
                )}
              </div>
              {isOnCooldown && !clickedItems.has(i) && (
                <div className={styles.cooldownOverlay}>
                  <div className={styles.cooldownMessage}>
                    Cooldown: {formatTime(timeRemaining)}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <a
            className={styles.noresult}
            target="_blank"
            href="https://www.nhs.uk/common-health-questions/accidents-first-aid-and-treatments/"
          >
            <div className={styles.no}>Couldn&#39;t find any medical waste items</div>
            <div className={styles.no2}>
              Click to search NHS guidelines for medical waste disposal
            </div>
          </a>
        )}
      </div>
      
      {/* Coin Animations */}
      {coinAnimations.map(coin => (
        <div
          key={coin.id}
          className={styles.coinAnimation}
          style={{
            left: coin.x - 25,
            top: coin.y - 25,
          }}
        >
          <div className={styles.coin}>
            <span>+{coin.points}</span>
          </div>
        </div>
      ))}
      
      {/* Confetti */}
      {confettiPieces.length > 0 && (
        <div className={styles.confettiContainer}>
          {confettiPieces.map(piece => (
            <div
              key={piece.id}
              className={styles.confettiPiece}
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.backgroundColor,
                animationDelay: `${piece.animationDelay}s`,
                animationDuration: `${piece.animationDuration}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Streak Achievement Message */}
      {showStreakMessage && (
        <div className={styles.streakMessage}>
          <h3>🎉 Streak Achieved! 🎉</h3>
          <p>Wait 5 minutes until you can earn points again</p>
        </div>
      )}
    </div>
  );
};

export default HowTo;
