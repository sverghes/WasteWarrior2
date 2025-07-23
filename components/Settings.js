import React from "react";
import styles from "./../styles/Settings.module.css";

const Settings = (props) => {
	console.log('Settings props:', props);
	console.log('setLeaderboard function exists:', typeof props.setLeaderboard === 'function');
	
	return (
		<div className={styles.settings}>
			<div className={styles.nav}>
				<img src="arrow-back.svg" onClick={() => props.setSettings(false)}/>
				<span className={styles.header}>Settings</span>
			</div>
			<div className={styles.all}>
				<div className={styles.item} onClick={() => props.setReset(true)}><span>Update department</span> <img src="enter.svg"/></div>
				<div className={styles.item} onClick={() => props.setLeaderboard(true)}><span>Leaderboard</span> <img src="enter.svg"/></div>
				<div className={styles.item} onClick={() => props.setOn(true)}><span>View onboarding</span> <img src="enter.svg"/></div>
				<div className={styles.space}></div>
				<a href="https://github.com/sverghes/WasteWarrior2" target="_blank" className={styles.item}><span>About this app</span> <img src="enter.svg"/></a>
				<a href="https://github.com/alyssaxuu/ecosnap?tab=readme-ov-file" target="_blank" className={styles.item}><span>Acknowledgements</span> <img src="enter.svg"/></a>
				<div className={styles.space}></div>
				<a href="https://ctmuhb.nhs.wales/hospitals/recycling/" target="_blank" className={styles.item}><span>CTMUHB Recycling</span> <img src="enter.svg"/></a>
				<div className={styles.space}></div>
				<a href="mailto:j.kulon@southwales.ac.uk;shiny.verghese@southwales.ac.uk" target="_blank" className={styles.item}><span>Contact us</span> <img src="enter.svg"/></a>
				<div className={styles.credit}>This app is adapted from Eco-snap linked to https://github.com/alyssaxuu/ecosnap?tab=readme-ov-file. The app is specially used in the recycling project with CTMUHB. The principal investigators are Dr Shiny Verghese and Prof Janusz Kulon from the University of South Wales.</div>
			</div>
		</div>
	)
}

export default Settings;