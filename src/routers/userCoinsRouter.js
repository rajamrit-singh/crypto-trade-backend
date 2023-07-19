const config = require('../../config');
const express = require('express');
const { getUserPurchasedCoins } = require('../controllers/userCoinsController');
const auth = require('../middlewares/authentication');

const router = new express.Router();


router.get('/mycoins', auth, async (req, res) => {
    try {
        const myCoins = await getUserPurchasedCoins(req.user.user_id);
        res.send(myCoins);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;