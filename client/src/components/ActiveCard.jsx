import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import tutorialStepsData from '../gameData/tutorialStepsData';
import functionContext from '../contexts/functionsContext.js';
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
  const { tutorStep } = useContext(functionContext);

  const { disAbility } = tutorialStepsData[tutorStep];

  const {
    thisPlayer, playerPoints, fieldCells, commonPoints, gameTurn, players,
  } = useSelector((state) => state.battleReducer);
  const firstRound = commonPoints === 1;
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const { cardsdrawn, switchedcard } = players[thisPlayer];
  const insteadatk = activeCard.features.find((feat) => feat.condition === 'insteadatk');
  const legalTurn = thisPlayer === gameTurn;
  const ressurect = fieldCells
    .find((cell) => cell.type === 'graveyard' && cell.player === thisPlayer)
    .attachments.find((feat) => feat.name === 'ressurect' && feat.aim.includes(activeCard.type));
  const leftPoints = insteadatk?.cost ? currentPoints - insteadatk.cost : 0;

  return (
    <div className={styles[cardClasses]}>
      <div className={styles.buttons}>
        {/* {(status === 'field') && (type === 'warrior' || type === 'hero')
        && gameMode === 'hotseat' && (
          <>
            <ActionButton card={activeCard} type="turnLeft" />
            <ActionButton card={activeCard} type="turnRight" />
          </>
        )} */}
        {!switchedcard && thisPlayer === activeCard.player && legalTurn && type !== 'hero' && status === 'hand' && (
          <ActionButton card={activeCard} ability={insteadatk} type="switchcard" />
        )}
        {((firstRound && thisPlayer === activeCard.player && !cardsdrawn && legalTurn) || gameMode === 'hotseat') && (type !== 'hero') && (
        <ActionButton card={activeCard} ability={insteadatk} type="deckreturn" />
        )}
        {insteadatk && activeCard.turn === 0 && leftPoints >= 0 && !disAbility && legalTurn && status !== 'graveyard' && (
          <ActionButton card={activeCard} ability={insteadatk} type="ability" />
        )}
        {/* {(status === 'field') && (type === 'warrior' || type === 'hero')
        && gameMode === 'hotseat' && (
          <ActionButton card={activeCard} type="healthBar" />
        )} */}
        {((status !== 'hand' && (type !== 'hero') && ressurect && activeCard.status === 'graveyard' && legalTurn) || gameMode === 'hotseat') && (
          <ActionButton card={activeCard} type="return" ressurect={ressurect} />
        )}
        {type !== 'hero' && status !== 'graveyard' && gameMode === 'hotseat' && (
          <ActionButton card={activeCard} type="graveyard" />
        )}
      </div>
      <Card
        card={activeCard}
        activeCard={activeCard}
        active
        playerType={playerType}
      />
    </div>
  );
};

export default ActiveCard;
