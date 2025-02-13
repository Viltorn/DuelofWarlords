const points = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
};

const HP = {
  1: 20,
  2: 22,
  3: 24,
  4: 26,
};

const getSetUpData = (difficulty) => {
  const startPoints = points[difficulty];
  const startHeroHP = HP[difficulty];
  return { startPoints, startHeroHP };
};

export default getSetUpData;
