import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import ActionButton from './ActionButton';
import Card from './Card';
import styles from './ActiveCard.module.css';

const ActiveCard = ({ activeCard, playerType }) => {
  const {
    status, type,
  } = activeCard;

  const cardClasses = cn({
    block1: playerType === 'player1',
    block2: playerType === 'player2',
  });
  const { gameMode } = useSelector((state) => state.gameReducer);
  // const { isOpened } = useSelector((state) => state.modalsReducer);
  const {
    thisPlayer, playerPoints, fieldCells, commonPoints,
  } = useSelector((state) => state.battleReducer);
  const firstRound = commonPoints === 1;
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const insteadatk = activeCard.features.find((feat) => feat.condition === 'insteadatk');
  const ressurect = fieldCells
    .find((cell) => cell.type === 'graveyard' && cell.player === thisPlayer)
    .attachments.find((feat) => feat.name === 'ressurect' && feat.aim.includes(activeCard.type));
  const leftPoints = insteadatk?.cost ? currentPoints - insteadatk.cost : 0;

  return (
    <div className={styles[cardClasses]}>
      <div className={styles.buttons}>
        {(status === 'field') && (type === 'warrior' || type === 'hero') && gameMode === 'hotseat' && (
          <>
            <ActionButton card={activeCard} type="turnLeft" />
            <ActionButton card={activeCard} type="turnRight" />
          </>
        )}
        {((firstRound && thisPlayer === activeCard.player) || gameMode === 'hotseat') && (type !== 'hero') && (
        <ActionButton card={activeCard} ability={insteadatk} type="deckreturn" />
        )}
        {insteadatk && activeCard.turn === 0 && leftPoints >= 0 && (
          <ActionButton card={activeCard} ability={insteadatk} type="ability" />
        )}
        {(status === 'field') && (type === 'warrior' || type === 'hero') && gameMode === 'hotseat' && (
          <ActionButton card={activeCard} type="healthBar" />
        )}
        {((status !== 'hand' && (type !== 'hero') && ressurect && activeCard.status === 'graveyard') || gameMode === 'hotseat') && (
          <ActionButton card={activeCard} type="return" ressurect={ressurect} />
        )}
        {type !== 'hero' && status !== 'graveyard' && gameMode === 'hotseat' && (
          <ActionButton card={activeCard} type="graveyard" />
        )}
      </div>
      <Card card={activeCard} activeCard={activeCard} active />
    </div>
  );
};

export default ActiveCard;
