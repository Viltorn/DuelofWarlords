import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { heroes } from '../../gameCardsData/factionsData.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './GreetingWindow.module.css';

const GreetingWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleContinue = () => {
    dispatch(modalActions.closeModal());
    dispatch(battleActions.disableCells({ ids: ['graveyard1', 'graveyard2'] }));
    dispatch(battleActions.changePlayer({ newPlayer: 'player1' }));
    dispatch(battleActions.setHero({ hero: heroes[0], player: 'player1' }));
    dispatch(battleActions.setHero({ hero: heroes[1], player: 'player2' }));
    dispatch(modalActions.openModal({ type: 'tutorialSteps' }));
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('TutorialWelcome')}</h2>
        <p className={styles.description}>{t('TutorialDescription')}</p>
        <PrimaryButton
          showIcon={false}
          state="default"
          text={t('CONTINUE')}
          variant="primary"
          type="submit"
          onClick={handleContinue}
        />
      </div>
    </dialog>
  );
};

export default GreetingWindow;
