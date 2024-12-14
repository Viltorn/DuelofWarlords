import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { startCardsNumber1, startCards2AfterDraw } from '../../gameData/gameLimits.js';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './StartFirstRound.module.css';

const EndTurnWarning = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const {
    actionPerforming,
    makeGameAction,
  } = useFunctionsContext();
  const { player } = useSelector((state) => state.modalsReducer);
  const { playersHands, gameTurn } = useSelector((state) => state.battleReducer);
  const thisHand = playersHands[player];
  const handSize = player === 'player1' ? startCardsNumber1 : startCards2AfterDraw;
  const diffSize = handSize - thisHand.length;

  const windowClasses = cn({
    [styles.window]: true,
    [styles.player1]: gameTurn === 'player1',
    [styles.player2]: gameTurn === 'player2',
  });

  const handleSubmit = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    dispatch(modalActions.closeModal());
    const data = {
      move: 'drawCards',
      room: curRoom,
      player,
      number: diffSize,
    };
    makeGameAction(data, gameMode);
  };

  return (
    <dialog className={windowClasses}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('modals.ChangeStartCards')}</h2>
        <PrimaryButton
          onClick={handleSubmit}
          showIcon={false}
          state="default"
          text={t('buttons.CONTINUE')}
          variant="primary"
          type="submit"
        />
      </div>
    </dialog>
  );
};

export default EndTurnWarning;
