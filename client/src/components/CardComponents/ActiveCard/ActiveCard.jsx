import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import ActionButton from '../../Buttons/ActionButton/ActionButton.jsx';
import Card from '../Card/Card.jsx';
import styles from './ActiveCard.module.css';
import isActiveCard from '../../../utils/supportFunc/isActiveCard.js';

const ActiveCard = ({
  activeCard, playerType, info,
}) => {
  const {
    status, type, cellId,
  } = activeCard;

  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    thisPlayer, playerPoints, fieldCells, roundNumber, gameTurn, players,
  } = useSelector((state) => state.battleReducer);
  const modalType = useSelector((state) => state.modalsReducer).type;

  const firstRound = roundNumber === 1;
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const { cardsdrawn, sucrificedCard } = players[thisPlayer];
  const cardAbilities = activeCard.features.filter((feat) => feat.condition === 'insteadatk' && !feat.attach);
  const attachedAbilities = activeCard.attachments?.filter((feat) => feat.condition === 'insteadatk') ?? [];
  const abilities = [...cardAbilities, ...attachedAbilities];
  const legalTurn = thisPlayer === gameTurn;
  const ressurect = fieldCells
    .find((cell) => cell.id === cellId && cell.type === 'graveyard')?.attachments
    .find((feat) => feat.name === 'ressurect' && feat.aim.includes(activeCard.subtype) && feat.player === gameTurn);
  const canUseAbilities = isActiveCard(activeCard) && !activeCard.disabled && legalTurn && status !== 'graveyard';
  const canSucrificeCard = !sucrificedCard && thisPlayer === activeCard.player && legalTurn && type !== 'hero' && status === 'hand';
  const canReturnCard = firstRound && thisPlayer === activeCard.player && !cardsdrawn && legalTurn;
  const canRessurectCard = status !== 'hand' && (type !== 'hero') && ressurect && activeCard.status === 'graveyard' && legalTurn;
  const canBeSentToGrave = type !== 'hero' && status !== 'graveyard' && gameMode === 'test';

  const cardClasses = cn({
    [styles.block1]: playerType === 'player1',
    [styles.block2]: playerType === 'player2',
    [styles.fistRound]: modalType === 'startFirstRound',
  });

  return (
    <div className={cardClasses}>
      {status !== 'void' && (
        <div className={styles.buttons}>
          {canSucrificeCard && gameMode !== 'build' && (
            <ActionButton card={activeCard} ability={null} type="sucrifice" name="sucrifice" />
          )}
          {(canReturnCard || gameMode === 'test') && (type !== 'hero') && gameMode !== 'build' && gameMode !== 'tutorial' && (
            <ActionButton card={activeCard} ability={null} type="deckreturn" name="deckreturn" />
          )}
          {gameMode !== 'build' && canUseAbilities && abilities.map((ability) => {
            const leftPoints = ability.cost ? currentPoints - ability.cost : 0;
            const costAllowed = leftPoints >= 0;
            return costAllowed
              ? (
                <ActionButton
                  key={ability.name}
                  card={activeCard}
                  ability={ability}
                  type="ability"
                  name={ability.description}
                />
              )
              : null;
          })}
          {(canRessurectCard || gameMode === 'test') && gameMode !== 'build' && (
            <ActionButton card={activeCard} type="return" ressurect={ressurect} name="return" />
          )}
          {canBeSentToGrave && gameMode !== 'build' && (
            <ActionButton card={activeCard} type="graveyard" name="graveyard" />
          )}
        </div>
      )}
      <Card
        card={activeCard}
        active
        isOpenInfo={info}
      />
    </div>
  );
};

export default ActiveCard;
