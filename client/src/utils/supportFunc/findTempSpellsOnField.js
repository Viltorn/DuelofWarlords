const findTempSpellsOnField = (curFieldCells, player) => curFieldCells
  .filter((cell) => cell.content.length !== 0 && cell.type !== 'postponed')
  .reduce((arr, cell) => {
    const spells = cell.content.filter((el) => el.subtype === 'temporary' && el.player === player);
    arr = [...arr, ...spells];
    return arr;
  }, []);

export default findTempSpellsOnField;
