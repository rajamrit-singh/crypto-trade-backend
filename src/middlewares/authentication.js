const config = require('../../config');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
            .replace('Bearer ', '');
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log(decoded);

        // Check if the token has expired
        const tokenExpiration = new Date(decoded.exp * 1000);
        const currentDateTime = new Date();

        if (currentDateTime > tokenExpiration) {
            throw new Error('Token has expired');
        }

        const userId = decoded.id;

        const query = 'SELECT * FROM users WHERE user_id = $1';
        const values = [userId];
        const { rows } = await pool.query(query, values);
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        req.user = rows[0]; //Storing the user for further usage
        delete req.user.password;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Invalid or expired token' });
    }
};

module.exports = auth;
