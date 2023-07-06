const pool = require('../db/pool');
const bcrypt = require('bcrypt');

const createUser = async (firstname, lastname, email, password) => {
    const encryptedPass = await bcrypt.hash(password, 8)
    const query = 'INSERT INTO users (user_id, first_name, last_name, email, password) VALUES (uuid_generate_v4(), $1, $2, $3, $4) RETURNING *';
    const values = [firstname, lastname, email, encryptedPass];
    console.log(values);
    try {
        const res = await pool.query(query, values);
        return res.rows[0];
        
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

module.exports = {
    createUser
}