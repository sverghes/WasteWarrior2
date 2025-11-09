import React, { useState, useEffect } from "react";
import styles from "./../styles/Settings.module.css";
import DatabaseAdmin from "./DatabaseAdmin";

const Settings = (props) => {
	const [showAdmin, setShowAdmin] = useState(false);
	const [adminKeySequence, setAdminKeySequence] = useState("");

	useEffect(() => {
		const handleKeyDown = (event) => {
			// Check for admin key sequence: "admin123"
			const newSequence = adminKeySequence + event.key.toLowerCase();
			setAdminKeySequence(newSequence);
			
			if (newSequence.includes("admin123")) {
				setShowAdmin(true);
				setAdminKeySequence("");
			}
			
			// Reset sequence after 3 seconds
			setTimeout(() => setAdminKeySequence(""), 3000);
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [adminKeySequence]);

	return (
		<div className={styles.settings}>
			<div className={styles.nav}>
				<img src="arrow-back.svg" alt="Back" onClick={() => props.setSettings(false)}/>
				<span className={styles.header}>Settings</span>
			</div>
			<div className={styles.all}>
				<div className={styles.item} onClick={() => props.setReset(true)}><span>Update department</span> <img src="enter.svg" alt="Go"/></div>
				<div className={styles.item} onClick={() => props.setLeaderboard(true)}><span>Leaderboard</span> <img src="enter.svg" alt="Go"/></div>
				<div className={styles.item} onClick={() => props.setOn(true)}><span>View onboarding</span> <img src="enter.svg" alt="Go"/></div>
				<div className={styles.space}></div>
				<a href="https://github.com/sverghes/WasteWarrior2" target="_blank" className={styles.item}><span>About this app</span> <img src="enter.svg" alt="Open link"/></a>
				<a href="https://github.com/alyssaxuu/ecosnap?tab=readme-ov-file" target="_blank" className={styles.item}><span>Acknowledgements</span> <img src="enter.svg" alt="Open link"/></a>
				<div className={styles.space}></div>
				<a href="https://ctmuhb.nhs.wales/hospitals/recycling/" target="_blank" className={styles.item}><span>CTMUHB Recycling</span> <img src="enter.svg" alt="Open link"/></a>
				<div className={styles.space}></div>
				<a href="mailto:j.kulon@southwales.ac.uk;shiny.verghese@southwales.ac.uk" target="_blank" className={styles.item}><span>Contact us</span> <img src="enter.svg" alt="Send email"/></a>

				<div className={styles.space}></div>

				{/* Hidden admin trigger */}
				<div 
					style={{ 
						position: 'absolute', 
						bottom: '10px', 
						right: '10px', 
						fontSize: '10px', 
						opacity: 0.3,
						cursor: 'pointer'
					}}
					onClick={() => setShowAdmin(true)}
				>
					🛠️
				</div>
				
				<div className={styles.credit}>This app is adapted from Eco-snap linked to https://github.com/alyssaxuu/ecosnap?tab=readme-ov-file. The app is specially used in the recycling project with CTMUHB. The principal investigators are Dr Shiny Verghese and Prof Janusz Kulon from the University of South Wales.</div>
			</div>
			
			{showAdmin && <DatabaseAdmin onClose={() => setShowAdmin(false)} />}
		</div>
	)
}

export default Settings;