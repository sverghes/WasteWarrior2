import React, { useEffect, useState } from "react";
import styles from "./../styles/HowTo.module.css";

const HowTo = (props) => {
  const [searchField, setSearchField] = useState("");
  const [coinAnimations, setCoinAnimations] = useState([]);
  const [clickedItems, setClickedItems] = useState(new Set());
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
    
    // Don't add points if already clicked
    if (clickedItems.has(index)) {
      return;
    }

    // Add to clicked items
    setClickedItems(prev => new Set([...prev, index]));
    
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
    
    // Remove coin animation after animation completes
    setTimeout(() => {
      setCoinAnimations(prev => prev.filter(coin => coin.id !== coinId));
    }, 2000);

    // Trigger page refresh to update dashboard points
    if (props.onPointsUpdate) {
      props.onPointsUpdate(newPoints);
    }
  };

  return (
    <div className={styles.howto}>
      <div className={styles.title}>Medical Waste Disposal Guide</div>
      <div className={styles.input}>
        <img src="search.svg" className={styles.search} />
        {searchField.length > 0 && (
          <img
            src="searchclear.svg"
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
            </div>
          ))
        ) : (
          <a
            className={styles.noresult}
            target="_blank"
            href="https://www.nhs.uk/common-health-questions/accidents-first-aid-and-treatments/"
          >
            <div className={styles.no}>Couldn't find any medical waste items</div>
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
    </div>
  );
};

export default HowTo;
