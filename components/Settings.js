import React from "react";
import styles from "./../styles/Settings.module.css";

const Settings = (props) => {
	return (
		<div className={styles.settings}>
			<div className={styles.nav}>
				<img src="arrow-back.svg" onClick={() => props.setSettings(false)}/>
				<span className={styles.header}>Settings</span>
			</div>
			<div className={styles.all}>
				<div className={styles.item} onClick={() => props.setReset(true)}><span>Update department</span> <img src="enter.svg"/></div>
				<div className={styles.item} onClick={() => props.setOn(true)}><span>View onboarding</span> <img src="enter.svg"/></div>
				<div className={styles.space}></div>
				<a href="https://github.com/sverghes/wastewarrior" target="_blank" className={styles.item}><span>About this app</span> <img src="enter.svg"/></a>
				<a href="https://github.com/sverghes/wastewarrior" target="_blank" className={styles.item}><span>Acknowledgements</span> <img src="enter.svg"/></a>
				<div className={styles.space}></div>
				<a href="https://ctmuhb.nhs.wales/hospitals/recycling/" target="_blank" className={styles.item}><span>CTMUHB Recycling</span> <img src="enter.svg"/></a>
				<div className={styles.space}></div>
				<a href="mailto:hi@alyssax.com" target="_blank" className={styles.item}><span>Contact us</span> <img src="enter.svg"/></a>
				<div className={styles.credit}>Adapted from Eco-snap</div>
			</div>
		</div>
	)
}

export default Settings;