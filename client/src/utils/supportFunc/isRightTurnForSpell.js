export default (spell, turn) => {
  if (spell.subtype === 'reaction') return spell.player !== turn;
  return true;
};
