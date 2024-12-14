const getRandomFromArray = (arr) => {
  const maxIndex = arr.length - 1;
  const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
  return arr[randomIndex];
};

export default getRandomFromArray;
