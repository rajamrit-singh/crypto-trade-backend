const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const config = require('../../config');
const jwt = require('jsonwebtoken');

const createUser = async (firstname, lastname, email, password) => {
    const encryptedPass = await bcrypt.hash(password, 8)
    const query = 'INSERT INTO users (user_id, first_name, last_name, email, password, balance) VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5) RETURNING *';
    const values = [firstname, lastname, email, encryptedPass, 2000];
    try {
        const res = await pool.query(query, values);
        const user = res.rows[0];
        delete user.password;
        return user;

    } catch (error) {
        console.error('Error creating user:', error);
    }
};

const loginUser = async (email, password) => {
    const query = 'SELECT * FROM users WHERE email = $1'
    const values = [email];
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    delete user.password;
    return user;
}

const generateToken = (id) => {
    const token = jwt.sign({ id }, config.JWT_SECRET, { expiresIn: '2 weeks' });
    return token
}

module.exports = {
    createUser,
    loginUser,
    generateToken
}
