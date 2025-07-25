import React, { useState, useEffect } from "react";
import styles from "../styles/DepartmentSelector.module.css";

const DepartmentSelector = ({ onDepartmentSelect }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [previewWarriorIds, setPreviewWarriorIds] = useState({
    Theatre: "TW####",
    Pathology: "PW####"
  });

  useEffect(() => {
    // Generate preview IDs to show what IDs users will get
    const generatePreviews = () => {
      // For new users, show the format they'll get
      setPreviewWarriorIds({
        Theatre: "TW####",
        Pathology: "PW####"
      });
    };

    generatePreviews();
  }, []);

  const handleContinue = () => {
    if (selectedDepartment) {
      localStorage.setItem("department", selectedDepartment);
      onDepartmentSelect(selectedDepartment);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>🏥 Choose Your Department</h2>
          <p>Join the leaderboard and compete with healthcare heroes across all departments!</p>
        </div>
        
        <div className={styles.options}>
          <div 
            className={`${styles.option} ${selectedDepartment === "Theatre" ? styles.selected : ""}`}
            onClick={() => setSelectedDepartment("Theatre")}
          >
            <div className={styles.emoji}>🏥</div>
            <div className={styles.name}>Theatre Department</div>
            <div className={styles.desc}>Surgical and operating theatre waste</div>
            <div className={styles.warriorPreview}>You'll get WarriorID: {previewWarriorIds.Theatre}</div>
          </div>
          
          <div 
            className={`${styles.option} ${selectedDepartment === "Pathology" ? styles.selected : ""}`}
            onClick={() => setSelectedDepartment("Pathology")}
          >
            <div className={styles.emoji}>🔬</div>
            <div className={styles.name}>Pathology Department</div>
            <div className={styles.desc}>Laboratory and specimen waste</div>
            <div className={styles.warriorPreview}>You'll get WarriorID: {previewWarriorIds.Pathology}</div>
          </div>
        </div>
        
        <button 
          className={`${styles.continueBtn} ${!selectedDepartment ? styles.disabled : ""}`}
          onClick={handleContinue}
          disabled={!selectedDepartment}
        >
          Join the Healthcare Heroes! 🚀
        </button>
      </div>
    </div>
  );
};

export default DepartmentSelector;
