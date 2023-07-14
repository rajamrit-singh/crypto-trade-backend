const express = require('express')
const pool = require('../db/pool');
const { getTransactionsForUser, makeTransaction } = require('../controllers/transactionsController');
const router = new express.Router();
const auth = require('../middlewares/authentication');

router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = getTransactionsForUser(req.user.user_id);
        res.send(transactions);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/transaction/buy', auth, async (req, res) => {
    const { crypto_id, quantity } = req.body;
    try {
        const transaction = await makeTransaction(req.user, crypto_id, quantity, 'buy');
        res.send(transaction);
    } catch(error) {
        res.status(400).send(error.message);
    }
});

router.post('/transaction/sell', auth, async (req, res) => {
    const { user_id, crypto_id, quantity } = req.body;
    try {
        const transaction = await makeTransaction(user_id, crypto_id, quantity, 'sell');
        res.send(transaction);
    } catch(error) {
        res.status(400).send(error);
    }
});

module.exports = router;