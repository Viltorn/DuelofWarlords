const getWarsNumInLine = (line, fieldCards) => {
  const warsInline = fieldCards.filter((card) => card.cellId[2] === line);
  return warsInline.length;
};

export default getWarsNumInLine;
