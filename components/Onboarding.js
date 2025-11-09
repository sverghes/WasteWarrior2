import React, { useState } from "react";
import styles from "./../styles/Onboarding.module.css";

const Onboarding = (props) => {
  const [step, setStep] = useState(1);

  const handleStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  return (
    <div className={styles.onboarding}>
      <div
        className={styles.skip}
        onClick={() => {
          props.setDone(true);
          props.setOn(false);
        }}
      >
        Skip
      </div>
      {step === 1 && (
        <div className={styles.image}>
        <img src="1handright.svg" className={styles.handright} alt="Hand pointing right" />
        <img src="1handleft.svg" className={styles.handleft} alt="Hand pointing left" />
        </div>
      )}
      {step === 2 && (
        <div className={styles.image}>
        <img src="2robot.svg" className={styles.robot} alt="Robot assistant" />
        <img src="2smoke.svg" className={styles.smoke} alt="Smoke illustration" />
        <img src="2question.svg" className={styles.question} alt="Question mark" />
        </div>
      )}
      {step === 3 && (
        <div className={styles.image}>
        <img src="3trash.svg" className={styles.trash} alt="Trash can" />
        <img src="3trees.svg" className={styles.trees} alt="Trees" />
        </div>
      )}
      <div className={styles.bottom}>
        <div className={styles.progress}>
          <div
            onClick={() => setStep(1)}
            className={step === 1 ? styles.active : styles.inactive}
          ></div>
          <div
            onClick={() => setStep(2)}
            className={step === 2 ? styles.active : styles.inactive}
          ></div>
          <div
            onClick={() => setStep(3)}
            className={step === 3 ? styles.active : styles.inactive}
          ></div>
        </div>
        {step === 1 && (
          <div>
            <div className={styles.text}>Snap a picture of medical waste</div>
            <div className={styles.subtitle}>
              Take a clear photo of any medical waste item - surgical instruments, contaminated materials, specimens, or containers. Position it clearly in the center for best AI recognition.
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className={styles.text}>AI identifies waste category</div>
            <div className={styles.subtitle}>
              Our AI will classify the medical waste and provide disposal protocols. You can correct the AI if needed and earn points for helping improve the system.
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className={styles.text}>
              Learn proper disposal protocols
            </div>
            <div className={styles.subtitle}>
              Get specific disposal instructions, safety requirements, and regulatory compliance information for Theatre and Pathology departments.
            </div>
          </div>
        )}
        {step < 3 && (
          <div className={styles.next} onClick={() => handleStep()}>
          <img src="arrow.svg" alt="Next" />
          </div>
        )}
        {step === 3 && (
          <div
            className={styles.button}
            onClick={() => {
              props.setDone(true);
              props.setOn(false);
            }}
          >
            Start classifying waste
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
