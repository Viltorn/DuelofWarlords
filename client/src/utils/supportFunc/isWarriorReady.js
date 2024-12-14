const isWarriorReady = (warCard, player, gameTurn) => {
  if (!warCard) {
    return false;
  }
  return warCard && player === gameTurn && warCard.turn === 0;
};

export default isWarriorReady;
