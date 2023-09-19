import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import PrimaryButton from '../../components/PrimaryButton';
import styles from './greetingWindow.module.css';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(modalActions.closeModal());
    dispatch(modalActions.openModal({ type: 'tutorialSteps' }));
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialWelcome')}</h2>
        <p className={styles.description}>Здесь вы изучите основы игры Duel of Warlords</p>
        <PrimaryButton
          showIcon={false}
          state="default"
          text={t('Continue')}
          variant="primary"
          type="submit"
          onClick={handleContinue}
        />
      </div>
    </dialog>
  );
};

export default GreetingWindow;
