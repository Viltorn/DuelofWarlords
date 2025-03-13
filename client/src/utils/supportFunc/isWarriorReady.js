const isWarriorReady = (warCard, player, gameTurn) => {
  if (warCard && (warCard.type === 'warrior' || warCard.type === 'hero')) {
    return warCard.player === player && player === gameTurn && warCard.turn === 0;
  }
  return false;
};

export default isWarriorReady;
