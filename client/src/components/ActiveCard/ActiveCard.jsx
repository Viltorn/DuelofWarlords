import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import tutorialStepsData from '../../gameData/tutorialStepsData.js';
import functionContext from '../../contexts/functionsContext.js';
import ActionButton from '../ActionButton/ActionButton.jsx';
import Card from '../Card/Card.jsx';
import styles from './ActiveCard.module.css';

const ActiveCard = ({
  activeCard, playerType, selectedHero,
}) => {
  const {
    status, type, qty,
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

  const canSwitchCard = !switchedcard && thisPlayer === activeCard.player && legalTurn && type !== 'hero' && status === 'hand';
  const canReturnCard = firstRound && thisPlayer === activeCard.player && !cardsdrawn && legalTurn;
  const canUseAbility = insteadatk && activeCard.turn === 0 && leftPoints >= 0 && !disAbility && legalTurn && status !== 'graveyard';
  const canRessurectCard = status !== 'hand' && (type !== 'hero') && ressurect && activeCard.status === 'graveyard' && legalTurn;
  const canBeSentToGrave = type !== 'hero' && status !== 'graveyard' && gameMode === 'hotseat';

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
        {/* {(status === 'field') && (type === 'warrior' || type === 'hero')
        && gameMode === 'hotseat' && (
          <ActionButton card={activeCard} type="healthBar" />
        )} */}
        {canSwitchCard && gameMode !== 'build' && (
          <ActionButton card={activeCard} ability={insteadatk} type="switchcard" />
        )}
        {(canReturnCard || gameMode === 'hotseat') && (type !== 'hero') && gameMode !== 'build' && (
          <ActionButton card={activeCard} ability={insteadatk} type="deckreturn" />
        )}
        {canUseAbility && gameMode !== 'build' && (
          <ActionButton card={activeCard} ability={insteadatk} type="ability" />
        )}
        {(canRessurectCard || gameMode === 'hotseat') && gameMode !== 'build' && (
          <ActionButton card={activeCard} type="return" ressurect={ressurect} />
        )}
        {canBeSentToGrave && gameMode !== 'build' && (
          <ActionButton card={activeCard} type="graveyard" />
        )}
        {gameMode === 'build' && ((!selectedHero && type === 'hero') || (type !== 'hero')) && (
          <ActionButton card={activeCard} type="addToDeck" />
        )}
        {gameMode === 'build' && qty !== 0 && selectedHero && (
          <ActionButton card={activeCard} type="deleteFromDeck" />
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
