import { createClient } from 'redis';

const redisClient = async () => {
  const client = createClient({
      url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  // Send and retrieve some values
  console.log('redis connected');
  return client;
};

export default await redisClient();
