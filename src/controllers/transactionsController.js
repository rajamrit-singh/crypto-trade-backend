const pool = require('../db/pool');
const { getCoin } = require('./coinsController');

const getTransactionsForUser = async (user_id) => {
    const query =  'SELECT * FROM transactions WHERE user_id = $1';
    const values = [user_id];
    try {
        const res = await pool.query(query, values);
        const transactions = res.rows[0];
        return transactions;

    } catch (error) {
        throw new Error(error);
    }
}

const makeTransaction = async (user_id, crypto_id, quantity, transaction_type) => {
    const coinData = await getCoin(crypto_id);
    const cost = coinData.price;
    const totalAmount = cost * quantity;
    const query = `INSERT INTO transactions (transaction_id, user_id, transaction_type, transaction_timestamp, crypto_cost, crypto_id, quantity, total_amount)
                    VALUES (uuid_generate_v4(), $1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6) RETURNING *`;
    const values = [user_id, transaction_type, cost, crypto_id, Number(quantity), totalAmount];

    try {
        const res = await pool.query(query, values);
        const transaction = res.rows[0];
        return transaction;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}


module.exports = {
    getTransactionsForUser,
    buyCurrency,
    makeTransaction
}