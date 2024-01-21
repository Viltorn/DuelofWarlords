import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import Card from '../../components/Card/Card.jsx';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton.jsx';
import styles from './CheckGraveyard.module.css';

const Graveyard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { player, data } = useSelector((state) => state.modalsReducer);
  const { fieldCells, playersDecks } = useSelector((state) => state.battleReducer);
  const currentGraveyard = fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard');
  const graveyardContent = currentGraveyard.content;
  const deckToShow = playersDecks[player];

  const [isShowAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 0);
  }, []);

  const appear = { transform: 'translateY(0)' };

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  return (
    <dialog className={styles.window} style={isShowAnimation ? appear : {}}>
      <div className={styles.container}>
        <h2 className={styles.header}>{data === 'grave' ? t('PlayedCards') : t('Deck')}</h2>
        <div className={styles.buttons}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('CLOSE')}
            variant="secondary"
            onClick={handleClose}
          />
        </div>
        <div className={styles.hand}>
          {data === 'grave' && (graveyardContent.map((card) => (
            <Card
              key={card.id}
              contentLength={graveyardContent.length}
              card={card}
            />
          )))}
          {data === 'deck' && (deckToShow.map((card) => (
            <Card
              key={card.id}
              contentLength={deckToShow.length}
              card={card}
            />
          )))}
        </div>
      </div>
    </dialog>
  );
};

export default Graveyard;
