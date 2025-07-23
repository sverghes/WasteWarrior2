import React, { useEffect, useState } from "react";
import styles from "./../styles/Splash.module.css"
import RegionSelect from "./RegionSelect";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";
import Viewer from "./Viewer";
import Settings from "./Settings";
import Gamification from "./Gamification";
import LeaderboardPage from "./LeaderboardPage";

const Splash = (props) => {
	const [getStarted, setGetStarted] = useState(false);
	const [done, setDone] = useState(false);
	const [done2, setDone2] = useState(false);
	const [view, setView] = useState(false);
	const [settings, setSettings] = useState(false);
	const [reset, setReset] = useState(false);
	const [on, setOn] = useState(false);
	const [leaderboard, setLeaderboard] = useState(false);

	useEffect(() => {
		// Only set done to true if user has clicked "Get started" AND region is set
		if (props.region > 0 && getStarted) {
			setDone(true);
		}
	}, [props.region, getStarted]);

	useEffect(() => {
		if (props.onboarding && getStarted) {
			setDone2(true);
		}
	}, [props.onboarding, getStarted]);

	useEffect(() => {
		if (done2) {
			localStorage.setItem("onboarding", true);
			setOn(false);
		}
	}, [done2]);

	const handleRegion = (number) => {
		props.setRegion(number);
		localStorage.setItem("region", number);
		setDone(true);
		setReset(false);
		
		// If user has previously completed onboarding, skip it
		if (props.onboarding) {
			setDone2(true);
		}
	}

	return (
		<div className={styles.container}>
			<Gamification />
			{view &&
				<Viewer pred={props.pred} setPred={props.setPred} tensor={props.tensor} setTensor={props.setTensor} setView={setView} setNum={props.setNum} num={props.num} region={props.region}/>
			}
			{leaderboard &&
				<LeaderboardPage onBack={() => setLeaderboard(false)} />
			}
			{settings && !reset && !on &&
				<Settings setSettings={setSettings} setReset={setReset} setOn={setOn} setLeaderboard={setLeaderboard} />
			}
			{done && done2 && !view && !settings && !leaderboard &&
				<Dashboard setSettings={setSettings} setView={setView} num={props.num} setNum={props.setnum} region={props.region} />
			}
			{on &&
				<Onboarding setDone={setDone2} setOn={setOn} />
			}
			{getStarted && done && !done2 &&
				<Onboarding setDone={setDone2} setOn={setOn} />
			}
			{reset &&
				<RegionSelect handleRegion={handleRegion} region={props.region} />
			}
			{getStarted && !done &&
				<RegionSelect handleRegion={handleRegion} region={props.region} />
			}
			{!getStarted &&
			<div className={styles.splash}>
				<div className={styles.logo}>
					<img src="logo.svg"/>
					WasteWarrior
				</div>
				<div className={styles.illustration}>
					<img className={styles.clouds} src="clouds.svg"/>
					<img className={styles.trees} src="trees.svg"/>
					<img className={styles.person} src="person.svg"/>
					<img className={styles.flower} src="flower.svg"/>
					<img className={styles.trash} src="trash.svg"/>
					<img className={styles.ground} src="ground.svg"/>
				</div>
				<div className={styles.title}>Manage medical waste better with Artificial Intelligence</div>
				<div className={styles.subtitle}>Take a picture of medical waste and learn proper classification and disposal protocols for Theatre and Pathology departments.</div>
				<div className={styles.button} onClick={() => setGetStarted(true)}>Get started</div>
				<a className={styles.about} href="https://github.com/sverghes/wastewarrior" target="_blank">About</a>
			</div>
			}
		</div>
	)
}

export default Splash;