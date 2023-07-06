const express = require('express')
const pool = require('../db/pool');
const router = new express.Router();
const { createUser } = require('../controllers/users');

router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const user = await createUser(firstname, lastname, email, password);
        res.send(user);
    } catch (err) {
        res.status(400).send(400);
    }
});

module.exports = router;