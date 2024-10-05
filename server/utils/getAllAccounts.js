import redis from "../redisInit.js";

const getAllAccounts = async () => {
  const rawAccounts = await redis.get('DofWAccounts', async function(err, result) {
    if (err) {
      console.log('DatabaseError');
    } else if (result === null) {
      console.log('No Accounts');
    } else {
      console.log(result);
    }
  });
  return JSON.parse(rawAccounts);
};

export default getAllAccounts;