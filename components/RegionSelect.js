import React, { useEffect, useState } from "react";
import styles from "./../styles/RegionSelect.module.css";

const RegionSelect = (props) => {
	const [option, setOption] = useState(props.region);

	const handleContinue = () => {
		props.handleRegion(option);
	}

	return (
		<div className={styles.regionselect}>
			<div className={styles.title}>Select your department</div>
			<div className={styles.subtitle}>We'll give you medical waste management advice tailored to your department's specific needs.</div>
			<div className={styles.options}>
				<div className={option === 1 ? styles.optioncheck : styles.option} onClick={() => setOption(1)}>
					<div className={styles.info}>
					<img src={option === 1 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🏥 Theatre Department</div>
						<div className={styles.desc}>Surgical and operating theatre waste</div>
					</div>
				</div>
				<div className={option === 2 ? styles.optioncheck : styles.option} onClick={() => setOption(2)}>
				<div className={styles.info}>
						<img src={option === 2 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🔬 Pathology Department</div>
						<div className={styles.desc}>Laboratory and specimen waste</div>
					</div>
				</div>
				<div className={option === 3 ? styles.optioncheck : styles.option} onClick={() => setOption(3)}>
				<div className={styles.info}>
						<img src={option === 3 ? "checked.svg" : "unchecked.svg"}/>
						<div className={styles.name}>🏥 General Healthcare</div>
						<div className={styles.desc}>Universal medical waste guidelines</div>
					</div>
				</div>
			</div>
			<div className={option === 0 ? styles.disabled : styles.button} onClick={() => handleContinue()}>Continue</div>
		</div>
	)
}

export default RegionSelect;
