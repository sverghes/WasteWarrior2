import React, { useEffect, useState } from "react";
import styles from "./../styles/RegionSelect.module.css";
import { getUserWarriorId } from "../utils/warriorId";

const RegionSelect = (props) => {
	const [option, setOption] = useState(props.region);
	const [currentWarriorId, setCurrentWarriorId] = useState("");
	const [currentDepartment, setCurrentDepartment] = useState("");
	const [isLocked, setIsLocked] = useState(false);
	const [previewWarriorIds, setPreviewWarriorIds] = useState({
		1: "", // Theatre
		2: "", // Pathology  
		3: ""  // General
	});

	useEffect(() => {
		// Get current warrior ID and department
		const getCurrentId = async () => {
			const currentDept = localStorage.getItem("department");
			const storedWarriorId = localStorage.getItem("warriorId");
			
			if (currentDept && storedWarriorId) {
				// User already has a WarriorID - lock them to their current department
				setCurrentDepartment(currentDept);
				setCurrentWarriorId(storedWarriorId);
				setIsLocked(true);
				
				// Set the option to match their current department
				if (currentDept === "Theatre") {
					setOption(1);
				} else if (currentDept === "Pathology") {
					setOption(2);
				} else {
					setOption(3);
				}
			}
		};
		
		// Generate preview IDs for each department
		const generatePreviews = async () => {
			const previews = { 1: "", 2: "", 3: "" };
			
			// Theatre Department
			previews[1] = "TW####";
			
			// Pathology Department  
			previews[2] = "PW####";
			
			// General Healthcare
			previews[3] = "TW####";
			
			setPreviewWarriorIds(previews);
		};

		getCurrentId();
		generatePreviews();
	}, []);

	const handleContinue = () => {
		if (isLocked) {
			// If locked, just close the department selector and return to settings
			props.handleRegion(option); // This will close the RegionSelect
		} else {
			// Normal flow for unlocked users
			props.handleRegion(option);
		}
	}

	const handleOptionClick = (selectedOption) => {
		// Only allow selection if not locked or if selecting current department
		if (!isLocked) {
			setOption(selectedOption);
		}
	}

	return (
		<div className={styles.regionselect}>
			<div className={styles.title}>
				{isLocked ? "Your Department" : "Select your department"}
			</div>
			<div className={styles.subtitle}>
				{isLocked 
					? `You are permanently assigned to ${currentDepartment} Department to maintain leaderboard integrity and fair competition. Your WarriorID cannot be transferred between departments.`
					: "We'll give you medical waste management advice tailored to your department's specific needs."
				}
			</div>
			
			{currentWarriorId && (
				<div className={styles.currentWarrior}>
					<div className={styles.currentLabel}>Your WarriorID:</div>
					<div className={styles.currentId}>{currentWarriorId}</div>
					{isLocked && (
						<div className={styles.lockedMessage}>🔒 Department locked</div>
					)}
				</div>
			)}
			
			<div className={styles.options}>
				<div 
					className={`
						${option === 1 ? styles.optioncheck : styles.option} 
						${isLocked && option !== 1 ? styles.optionDisabled : ""}
					`} 
					onClick={() => handleOptionClick(1)}
				>
					<div className={styles.info}>
						<img
							src={option === 1 ? "checked.svg" : "unchecked.svg"}
							alt={option === 1 ? "Department selected" : "Department not selected"}
						/>
						<div className={styles.name}>🏥 Theatre Department</div>
						<div className={styles.desc}>Surgical and operating theatre waste</div>
						{previewWarriorIds[1] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[1]}</div>
						)}
					</div>
				</div>
				<div 
					className={`
						${option === 2 ? styles.optioncheck : styles.option} 
						${isLocked && option !== 2 ? styles.optionDisabled : ""}
					`} 
					onClick={() => handleOptionClick(2)}
				>
					<div className={styles.info}>
						<img
							src={option === 2 ? "checked.svg" : "unchecked.svg"}
							alt={option === 2 ? "Department selected" : "Department not selected"}
						/>
						<div className={styles.name}>🔬 Pathology Department</div>
						<div className={styles.desc}>Laboratory and specimen waste</div>
						{previewWarriorIds[2] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[2]}</div>
						)}
					</div>
				</div>
				<div 
					className={`
						${option === 3 ? styles.optioncheck : styles.option} 
						${isLocked && option !== 3 ? styles.optionDisabled : ""}
					`} 
					onClick={() => handleOptionClick(3)}
				>
					<div className={styles.info}>
						<img
							src={option === 3 ? "checked.svg" : "unchecked.svg"}
							alt={option === 3 ? "Department selected" : "Department not selected"}
						/>
						<div className={styles.name}>🏥 General Healthcare</div>
						<div className={styles.desc}>Universal medical waste guidelines</div>
						{previewWarriorIds[3] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[3]}</div>
						)}
					</div>
				</div>
			</div>
			<div 
				className={isLocked ? styles.buttonLocked : (option === 0 ? styles.disabled : styles.button)} 
				onClick={() => handleContinue()}
			>
				{isLocked ? "Return to Settings" : "Continue"}
			</div>
		</div>
	)
}

export default RegionSelect;
