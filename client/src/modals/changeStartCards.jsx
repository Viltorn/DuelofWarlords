import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as modalActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import PrimaryButton from '../components/PrimaryButton';
import { startCardsNumber1, startCards2AfterDraw } from '../gameData/gameLimits.js';
import './Modals.css';

const ChangeStartCards = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { playersHands } = useSelector((state) => state.battleReducer);
  const { player } = useSelector((state) => state.modalsReducer);
  const thisHand = playersHands[player];
  const handSize = player === 'player1' ? startCardsNumber1 : startCards2AfterDraw;
  const diffSize = handSize - thisHand.length;

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleSubmit = () => {
    dispatch(battleActions.setCardDrawStatus({ player, status: true }));
    dispatch(modalActions.closeModal());
    // eslint-disable-next-line functional/no-loop-statements
    for (let i = 1; i <= diffSize; i += 1) {
      dispatch(battleActions.drawCard({ player }));
    }
  };

  return (
    <dialog className="modal-window">
      <div className="modal-window__content">
        <h2 className="modal-window__header">{t('DrawCards')}</h2>
        <div className="modal-window__buttons">
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('DrawCard')}
            variant="primary"
            type="submit"
            onClick={handleSubmit}
          />
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('Close')}
            variant="secondary"
            onClick={handleClose}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ChangeStartCards;
