import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './LastStepWindow.module.css';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleExit = () => {
    dispatch(battleActions.resetState());
    dispatch(modalsActions.closeModal());
    dispatch(battleActions.setTutorialStep(0));
    navigate('/choose');
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialFinish')}</h2>
        <p className={styles.description}>
          {t('TutorialTips')}
        </p>
        <ul className={styles.tipsBlock}>
          <li className={styles.tip}>
            {t('tutorialTips.Tip1')}
          </li>
          <li className={styles.tip}>
            {t('tutorialTips.Tip2')}
          </li>
          <li className={styles.tip}>
            {t('tutorialTips.Tip3')}
          </li>
          <li className={styles.tip}>
            {t('tutorialTips.Tip4')}
          </li>
          <li className={styles.tip}>
            {t('tutorialTips.Tip5')}
          </li>
        </ul>
        <PrimaryButton
          showIcon={false}
          state="default"
          text={t('buttons.EXIT')}
          variant="primary"
          type="submit"
          onClick={handleExit}
        />
      </div>
    </dialog>
  );
};

export default GreetingWindow;
