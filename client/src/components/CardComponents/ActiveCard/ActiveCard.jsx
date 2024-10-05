import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import tutorialStepsData from '../../../gameData/tutorialStepsData.js';
import isHeroSpellAlLowed from '../../../utils/supportFunc/isHeroSpellAlLowed.js';
import ActionButton from '../../Buttons/ActionButton/ActionButton.jsx';
import Card from '../Card/Card.jsx';
import styles from './ActiveCard.module.css';
import useBattleActions from '../../../hooks/useBattleActions.js';

const isActiveCard = (card) => (card.type === 'warrior' || card.type === 'hero' ? card.turn === 0 : true);

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
  const {
    thisPlayer, playerPoints, fieldCells, fieldCards, commonPoints, gameTurn, players,
  } = useSelector((state) => state.battleReducer);
  const { tutorStep } = useBattleActions();
  const { disAbility } = tutorialStepsData[tutorStep];

  const firstRound = commonPoints === 1;
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const { cardsdrawn, sucrificedCard } = players[thisPlayer];
  const abilities = activeCard.features.filter((feat) => feat.condition === 'insteadatk');
  const legalTurn = thisPlayer === gameTurn;
  const ressurect = fieldCells
    .find((cell) => cell.type === 'graveyard' && cell.player === thisPlayer)
    .attachments.find((feat) => feat.name === 'ressurect' && feat.aim.includes(activeCard.type));
  const heroCard = fieldCards.find((card) => card.type === 'hero' && card.player === activeCard.player);
  const canUseAbilities = isActiveCard(activeCard) && isHeroSpellAlLowed(activeCard, heroCard) && !disAbility && legalTurn && status !== 'graveyard';
  const canSucrificeCard = !sucrificedCard && thisPlayer === activeCard.player && legalTurn && type !== 'hero' && status === 'hand';
  const canReturnCard = firstRound && thisPlayer === activeCard.player && !cardsdrawn && legalTurn;
  const canRessurectCard = status !== 'hand' && (type !== 'hero') && ressurect && activeCard.status === 'graveyard' && legalTurn;
  const canBeSentToGrave = type !== 'hero' && status !== 'graveyard' && gameMode === 'hotseat';

  return (
    <div className={styles[cardClasses]}>
      <div className={styles.buttons}>
        {canSucrificeCard && gameMode !== 'build' && (
          <ActionButton card={activeCard} ability={null} type="sucrifice" name="sucrifice" />
        )}
        {(canReturnCard || gameMode === 'hotseat') && (type !== 'hero') && gameMode !== 'build' && (
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
                name={ability.name}
              />
            )
            : null;
        })}
        {(canRessurectCard || gameMode === 'hotseat') && gameMode !== 'build' && (
          <ActionButton card={activeCard} type="return" ressurect={ressurect} name="return" />
        )}
        {canBeSentToGrave && gameMode !== 'build' && (
          <ActionButton card={activeCard} type="graveyard" name="graveyard" />
        )}
        {gameMode === 'build' && ((!selectedHero && type === 'hero') || (type !== 'hero')) && (
          <ActionButton card={activeCard} type="addToDeck" name="addToDeck" />
        )}
        {gameMode === 'build' && qty !== 0 && selectedHero && (
          <ActionButton card={activeCard} type="deleteFromDeck" name="deleteFromDeck" />
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
