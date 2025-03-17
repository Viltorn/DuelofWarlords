const isWarriorReady = (warCard, gameTurn) => {
  if (warCard && (warCard.type === 'warrior' || warCard.type === 'hero')) {
    return warCard.player === gameTurn && warCard.turn === 0;
  }
  return false;
};

export default isWarriorReady;
