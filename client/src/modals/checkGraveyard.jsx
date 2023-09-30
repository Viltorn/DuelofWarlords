import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalActions } from '../slices/modalsSlice.js';
// import { actions as battleActions } from '../slices/battleSlice.js';
import Card from '../components/Card.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import styles from './checkGraveyard.module.css';

const Graveyard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { player } = useSelector((state) => state.modalsReducer);
  const { fieldCells } = useSelector((state) => state.battleReducer);
  const currentGraveyard = fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard');
  const graveyardContent = currentGraveyard.content;

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.container}>
        <h2 className={styles.header}>{t('PlayedCards')}</h2>
        <div className={styles.buttons}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('Close')}
            variant="secondary"
            onClick={handleClose}
          />
        </div>
        <div className={styles.hand}>
          {graveyardContent.map((card) => (
            <Card
              key={card.id}
              content={graveyardContent}
              card={card}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
};

export default Graveyard;
