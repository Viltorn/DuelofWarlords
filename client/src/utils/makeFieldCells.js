const makeFieldCells = (data) => {
  const cellsPlayer1 = data.rows.flatMap((row) => data.linesSideOne.map((line) => ({
    id: `${row}.${line}`, row, line, player: 'player1', content: [], type: 'field',
  })));

  const cellsPlayer2 = data.rows.flatMap((row) => data.linesSideTwo.map((line) => ({
    id: `${row}.${line}`, row, line, player: 'player2', content: [], type: 'field',
  })));

  return [...cellsPlayer1, ...cellsPlayer2];
};

export default makeFieldCells;