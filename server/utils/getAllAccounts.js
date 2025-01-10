import redis from "../redisInit.js";

const getAllAccounts = async (names) => {
  try {
  const rawAccounts = await Promise.all(names.map(async (name) => {
    return JSON.parse(await redis.get(`DofWAccounts:${name}`));
  }));
  return rawAccounts;
  } catch (e) {
    console.log('DatabaseError');
  }
};

export default getAllAccounts;