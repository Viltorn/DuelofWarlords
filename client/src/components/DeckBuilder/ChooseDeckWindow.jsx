import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WarnWindow from './WarnWindow';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import DeckImage from './DeckImage';
import styles from './ChooseDeckWindow.module.css';

const ChooseDeckWindow = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playersDecks, name } = useSelector((state) => state.gameReducer);
  const { warnWindow, activeDeck } = useSelector((state) => state.deckbuilderReducer);

  const handleBack = () => {
    navigate('/choose');
  };

  const handleCreateClick = () => {
    navigate('/deckbuilder');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PrimaryButton
          onClick={handleCreateClick}
          showIcon={false}
          state="default"
          text={t('CREATEDECK')}
          variant="primary"
          type="button"
        />
        <PrimaryButton
          onClick={handleBack}
          showIcon={false}
          state="default"
          text={t('BACK')}
          type="button"
          variant="secondary"
        />
      </div>
      <hr className={styles.divider} />
      <h2 className={styles.title}>{t('YourDecks')}</h2>
      <div className={styles.roomsBlock}>
        {playersDecks.map((deck) => (
          <DeckImage
            deck={deck}
            key={deck.deckName}
            active={activeDeck === deck.deckName}
          />
        ))}
      </div>
      {warnWindow && (
        <WarnWindow name={activeDeck} user={name} type={warnWindow} />
      )}
    </div>
  );
};

export default ChooseDeckWindow;
