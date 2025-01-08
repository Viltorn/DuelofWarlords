import redis from '../redisInit.js';
import { v4 as uuidV4 } from 'uuid';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { password, username } = req.headers;
    const account = JSON.parse(await redis.get(`DofWAccounts:${username}`));
    if (!account) {
      res.status(401).json({ message: 'AccountNotFound' })
      return;
    }
    if (account.password !== password) {
      res.status(401).json({ message: 'PasswordInvalid' });
      return;
    }
    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ message: 'AuthOrNetError' })
    console.log(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const { password, username, decks } = req.body;
    const account = JSON.parse(await redis.get(`DofWAccounts:${username}`));
    if (account) {
      res.status(401).json({ message: 'UserAlreadyExist' })
      return;
    }
    const id = uuidV4();
    const userData = { password, username, decks, id };
    const setAccount = await redis.set(`DofWAccounts:${username}`,  JSON.stringify(userData));
    const users = JSON.parse(await redis.get(`DofWAccounts:accounts`)) ?? [];
    users.push(username);
    const setAccNames = await redis.set(`DofWAccounts:accounts`,  JSON.stringify(users));
    if (setAccount === 'OK' || setAccNames === 'OK') {
      console.log(userData);
      res.status(201).json(userData);
    }
  } catch (err) {
    res.status(500).json({ message: 'AuthOrNetError' })
    console.log(err.message);
  }
});

export default router;