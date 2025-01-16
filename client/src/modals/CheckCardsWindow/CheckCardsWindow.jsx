import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import Card from '../../components/CardComponents/Card/Card.jsx';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './CheckCardsWindow.module.css';
import { battleSelectors } from '../../slices/selectors/selectors.js';

// const getCardsToShow = {
//   grave: ({ fieldCells, player, fieldCards }) => {
//     const graveyardCellId = fieldCells
//          .find((cell) => cell.player === player && cell.type === 'graveyard').id;
//     return fieldCards.filter((card) => card.cellId === graveyardCellId);
//   },
//   deck: ({ playersDecks, player }) => playersDecks[player],
//   attached: ({ data, player }) => {
//     const goodCards = data.filter((card) => card.player === player);
//     const badCards = data.filter((card) => card.player !== player);
//     return [...badCards, ...goodCards];
//   },
// };

const getWindowName = {
  grave: 'PlayedCards',
  deck: 'Deck',
  attached: 'AttachedCards',
};

const CheckCardsWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { player, id, data } = useSelector((state) => state.modalsReducer);
  const cardsToShow = useSelector((state) => battleSelectors
    .getCheckCardsData(state, ({ player, id, data })));
  // const { fieldCells, fieldCards, playersDecks } = useSelector((state) => state.battleReducer);
  // const cardsToShow = getCardsToShow[id]({
  //   fieldCells, fieldCards, player, playersDecks, data,
  // });
  const appear = { transform: 'translateY(0)' };

  const [isShowAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 0);
  }, []);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  return (
    <dialog className={styles.window} style={isShowAnimation ? appear : {}}>
      <div className={styles.container}>
        <h2 className={styles.header}>{t(`${getWindowName[id]}`)}</h2>
        <div className={styles.buttons}>
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('buttons.CLOSE')}
            variant="secondary"
            onClick={handleClose}
          />
        </div>
        <div className={styles.hand}>
          {cardsToShow.map((card) => (
            <Card
              key={card.id}
              contentLength={cardsToShow.length}
              card={card}
            />
          ))}
        </div>
      </div>
    </dialog>
  );
};

export default CheckCardsWindow;
