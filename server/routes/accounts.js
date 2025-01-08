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
    console.log(err.message);
  }
});

router.get('/names', async (req, res) => {
  try {
    const { password, username } = req.headers;
    if (password !== 'heroes3' || username !== 'admin') {
      res.status(500).json({ message: "Wrong password or username!"});
      return;
    }
    const accountsNames = JSON.parse(await redis.get(`DofWAccounts:accounts`));
    if (!accountsNames) {
      res.status(500).json({ message: "NoAccountsSet!"});
      return;
    }
    res.status(200).json(accountsNames);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
  }
});

router.post('/', async (req, res) => {
  try {
    const password = req.body.password;
    const username = req.body.username;
    if (password !== 'heroes3' || username !== 'admin') {
      res.status(500).json({ message: "Wrong password or username!", password, username });
      return;
    }
    await redis.set('DofWAccounts',  JSON.stringify([]));
    res.status(201).json({ message: 'accounts sets'});
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err.message);
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
      res.status(200).json(account);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const accountName = req.params.name;
    const account = JSON.parse(await redis.get(`DofWAccounts:${accountName}`));
    if (!account) {
      res.status(401).json({ message: 'UserNotFound' })
      return;
    }
    const delAcc = await redis.del(`DofWAccounts:${accountName}`);
    const accNames = JSON.parse(await redis.get(`DofWAccounts:accounts`));
    const newAccNames = accNames.filter((acc) => acc !== accountName);
    const setNewAccNames = await redis.set(`DofWAccounts:accounts`, JSON.stringify(newAccNames));
    if (delAcc === 1 && setNewAccNames === 'OK') {
      res.status(200).json(`Accountdeleted: ${accountName}`);
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message })
  }
})

export default router;