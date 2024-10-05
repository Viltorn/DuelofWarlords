import redis from '../redisInit.js';
import getAllAccounts from '../utils/getAllAccounts.js';
import express from 'express';
import 'dotenv/config';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { password, username } = req.headers;
    if (password !== 'heroes3' || username !== 'admin') {
      res.status(500).json({ message: "Wrong password or username!"});
      return;
    }
    const accounts = await getAllAccounts();
    if (!accounts) {
      res.status(500).json({ message: "NoAccountsSet!"});
      return;
    }
    res.status(200).json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

router.post('/', async (req, res) => {
  try {
    const password = req.body.password;
    const username = req.body.username;
    console.log(username, password);
    if (password !== 'heroes3' || username !== 'admin') {
      res.status(500).json({ message: "Wrong password or username!", password, username });
      return;
    }
    await redis.set('DofWAccounts',  JSON.stringify([]));
    res.status(201).json({ message: 'accounts sets'});
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.patch('/', async (req, res) => {
  try {
    const username = req.body.username;
    const decks = req.body.decks;
    const account = JSON.parse(await redis.get(`DofWAccounts:${username}`));
    if (!account) {
      res.status(401).json({ message: 'UserNotFound' })
      return;
    }
    account.decks = decks;
    const setAcc = await redis.set(`DofWAccounts:${username}`,  JSON.stringify(account));
    if (setAcc === 'OK') {
      res.status(200).json(decks);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message })
  }
})

export default router;