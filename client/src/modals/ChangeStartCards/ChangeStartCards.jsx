import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import functionsContext from '../../contexts/functionsContext.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import { startCardsNumber1, startCards2AfterDraw } from '../../gameData/gameLimits.js';
import '../Modals.css';

const ChangeStartCards = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    actionPerforming,
    makeGameAction,
  } = useContext(functionsContext);

  const { playersHands } = useSelector((state) => state.battleReducer);
  const { player, roomId } = useSelector((state) => state.modalsReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const thisHand = playersHands[player];
  const handSize = player === 'player1' ? startCardsNumber1 : startCards2AfterDraw;
  const diffSize = handSize - thisHand.length;

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleSubmit = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    dispatch(modalActions.closeModal());
    const data = {
      move: 'drawCards',
      room: roomId,
      player,
      number: diffSize,
    };
    makeGameAction(data, gameMode);
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
            text={t('CLOSE')}
            variant="secondary"
            onClick={handleClose}
          />
        </div>
      </div>
    </dialog>
  );
};

export default ChangeStartCards;
