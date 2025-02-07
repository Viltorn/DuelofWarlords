import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './TutorialStepsWindow.module.css';
import tutorialStepsData from '../../gameData/tutorialStepsData.js';
import useTutorialActions from '../../hooks/useTutorialActions.js';

const TutorialStepsWindow = () => {
  const { t } = useTranslation();

  const { currentTutorStep } = useSelector((state) => state.battleReducer);
  const { makeTutorStepChange, stepFunctions } = useTutorialActions();

  const indent = tutorialStepsData[currentTutorStep].left ?? 0;

  console.log(currentTutorStep);
  const handleClick = (direct) => {
    makeTutorStepChange(direct);
  };

  useEffect(() => {
    const func = stepFunctions[tutorialStepsData[currentTutorStep].func];
    if (func) {
      func();
    }
    // eslint-disable-next-line
  }, [currentTutorStep]);

  return (
    <div className={styles.window} style={{ left: `${indent}rem` }}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t(`tutorialSteps.${tutorialStepsData[currentTutorStep].step}`)}</h2>
        <div className={styles.btnBlock}>
          {tutorialStepsData[currentTutorStep].back && (<button className={styles.btn} type="button" onClick={() => handleClick(-1)}>{t('buttons.BACK')}</button>)}
          {tutorialStepsData[currentTutorStep].next && (<button className={styles.btn} type="button" onClick={() => handleClick(1)}>{t('buttons.CONTINUE')}</button>)}
        </div>
      </div>
    </div>
  );
};

export default TutorialStepsWindow;
