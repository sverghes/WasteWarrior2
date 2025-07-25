import React, { useEffect, useState } from "react";
import styles from "./../styles/RegionSelect.module.css";
import { getUserWarriorId } from "../utils/warriorId";

const RegionSelect = (props) => {
	const [option, setOption] = useState(props.region);
	const [currentWarriorId, setCurrentWarriorId] = useState("");
	const [previewWarriorIds, setPreviewWarriorIds] = useState({
		1: "", // Theatre
		2: "", // Pathology  
		3: ""  // General
	});

	useEffect(() => {
		// Get current warrior ID
		const getCurrentId = async () => {
			const currentDept = localStorage.getItem("department");
			if (currentDept) {
				const warriorId = await getUserWarriorId(currentDept, false); // Don't force migration for preview
				setCurrentWarriorId(warriorId);
			}
		};
		
		// Generate preview IDs for each department
		const generatePreviews = async () => {
			const previews = { 1: "", 2: "", 3: "" };
			
			// Theatre Department
			const theatreId = await getUserWarriorId("Theatre", false);
			previews[1] = theatreId.startsWith("TW") ? theatreId : "TW####";
			
			// Pathology Department  
			const pathologyId = await getUserWarriorId("Pathology", false);
			previews[2] = pathologyId.startsWith("PW") ? pathologyId : "PW####";
			
			// General Healthcare (use existing or generate Theatre-style)
			previews[3] = "TW####";
			
			setPreviewWarriorIds(previews);
		};

		getCurrentId();
		generatePreviews();
	}, []);

	const handleContinue = () => {
		props.handleRegion(option);
	}

	return (
		<div className={styles.regionselect}>
			<div className={styles.title}>Select your department</div>
			<div className={styles.subtitle}>We'll give you medical waste management advice tailored to your department's specific needs.</div>
			
			{currentWarriorId && (
				<div className={styles.currentWarrior}>
					<div className={styles.currentLabel}>Your current WarriorID:</div>
					<div className={styles.currentId}>{currentWarriorId}</div>
				</div>
			)}
			
			<div className={styles.options}>
				<div className={option === 1 ? styles.optioncheck : styles.option} onClick={() => setOption(1)}>
					<div className={styles.info}>
					<img src={option === 1 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🏥 Theatre Department</div>
						<div className={styles.desc}>Surgical and operating theatre waste</div>
						{previewWarriorIds[1] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[1]}</div>
						)}
					</div>
				</div>
				<div className={option === 2 ? styles.optioncheck : styles.option} onClick={() => setOption(2)}>
				<div className={styles.info}>
						<img src={option === 2 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🔬 Pathology Department</div>
						<div className={styles.desc}>Laboratory and specimen waste</div>
						{previewWarriorIds[2] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[2]}</div>
						)}
					</div>
				</div>
				<div className={option === 3 ? styles.optioncheck : styles.option} onClick={() => setOption(3)}>
				<div className={styles.info}>
						<img src={option === 3 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🏥 General Healthcare</div>
						<div className={styles.desc}>Universal medical waste guidelines</div>
						{previewWarriorIds[3] && (
							<div className={styles.warriorPreview}>WarriorID: {previewWarriorIds[3]}</div>
						)}
					</div>
				</div>
			</div>
			<div className={option === 0 ? styles.disabled : styles.button} onClick={() => handleContinue()}>Continue</div>
		</div>
	)
}

export default RegionSelect;
