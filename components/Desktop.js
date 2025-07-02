import React from "react";
import styles from "./../styles/Desktop.module.css";
import Splash from "./Splash";

// Last updated: 2025-07-02 - Vercel deployment check
const Desktop = (props) => {
  return (
    <div className={styles.desktop}>
      {props.check && (
        <Splash
          region={props.region}
          pred={props.pred}
          setPred={props.setPred}
          tensor={props.tensor}
          setTensor={props.setTensor}
          setNum={props.setNum}
          num={props.num}
          onboarding={props.onboarding}
          setRegion={props.setRegion}
        />
      )}
      <a
        href="https://alyssax.substack.com/p/we-built-an-ai-recycling-app-in-a"
        target="_blank"
        className={styles.awards}
      >
        <img className={styles.award1} src="./award1.svg" />
        <img className={styles.award2} src="./award2.svg" />
      </a>
      <div className={styles.badge}>
        <img src="logo-with-back.svg" />
        <div className={styles.badgewrap}>
          <div className={styles.name}>WasteWarrior</div>
          <div className={styles.credit}>
            Adapted from Eco-snap
          </div>
        </div>
      </div>
      <div className={styles.qrcode}>
        <img src="qrcode.png" />
        <span>Open on your phone ✨</span>
      </div>
    </div>
  );
};

export default Desktop;
