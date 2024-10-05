const isWarriorReady = (content, player, gameTurn) => {
  const war = content.find((card) => card.type === 'warrior' || card.type === 'hero');
  return war && player === gameTurn && war.turn === 0;
};

export default isWarriorReady;
