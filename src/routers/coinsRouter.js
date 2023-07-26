const config = require('../../config');
const coinsUtil = require('../controllers/coinsController');
const express = require('express')

const router = new express.Router();

router.get('/coins', async (req, res) => {
    const { page, limit, uuids } = req.query;
    let uuidsParam;
    if (!uuids) {
        uuidsParam = [];
    } else {
        uuidsParam = uuids;
    }
    try {
        const coins = await coinsUtil.getCoins(limit, page, uuidsParam);
        res.send(JSON.stringify(coins));
    } catch (error) {
        res.status(500).send(`${error}. Unable to get data`)
    }

});

router.get('/coin/:uuid', async (req, res) => {
    const uuid = req.params.uuid;
    try {
        const coin = await coinsUtil.getCoin(uuid);
        res.send(JSON.stringify(coin));
    } catch (error) {
        res.status(500).send(`${error}. Unable to get data`)
    }
});

router.get('/coins/stats', async (req, res) => {
    try {
        const stats = await coinsUtil.getStats();
        res.send(stats);
    } catch(error) {
        res.status(500).send(error);
    }
})

router.get('/coin/')

module.exports = router;

