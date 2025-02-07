import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './GreetingWindow.module.css';
import useTutorialActions from '../../hooks/useTutorialActions.js';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { stepFunctions } = useTutorialActions();

  const handleContinue = () => {
    dispatch(battleActions.disableCells({ ids: ['graveyard1', 'graveyard2'] }));
    stepFunctions.step1();
    dispatch(battleActions.setTutorialStep(1));
    dispatch(modalActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialWelcome')}</h2>
        <p className={styles.description}>{t('TutorialDescription')}</p>
        <PrimaryButton
          showIcon={false}
          state="default"
          text={t('buttons.CONTINUE')}
          variant="primary"
          type="submit"
          onClick={handleContinue}
        />
      </div>
    </dialog>
  );
};

export default GreetingWindow;
