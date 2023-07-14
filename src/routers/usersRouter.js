const express = require('express')
const router = new express.Router();
const { createUser, loginUser, generateToken } = require('../controllers/usersController');
const auth = require('../middlewares/authentication');
const config = require('../../config');

router.post('/signup', async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const user = await createUser(first_name, last_name, email, password);        
        user.token = generateToken(user.user_id);
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        user.token = generateToken(user.user_id);;
        res.send(user);
    } catch (err) {
        res.status(400).send('User not found');
    }
})

router.get('/profile', auth, async(req, res) => {
    res.send(req.user);
});

module.exports = router;