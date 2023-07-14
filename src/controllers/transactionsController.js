const pool = require('../db/pool');
const { getCoin } = require('./coinsController');

const getTransactionsForUser = async (user_id) => {
    const query = 'SELECT * FROM transactions WHERE user_id = $1';
    const values = [user_id];
    try {
        const res = await pool.query(query, values);
        const transactions = res.rows[0];
        return transactions;

    } catch (error) {
        throw new Error(error);
    }
}

const makeTransaction = async (user, crypto_id, quantity, transaction_type, req) => {
    const coinData = await getCoin(crypto_id);
    const cost = coinData.price;
    // Convert user.balance to numeric
    const userBalanceQuery = 'SELECT $1::money::numeric';
    const userBalanceValues = [user.balance];
    const userBalanceResult = await pool.query(userBalanceQuery, userBalanceValues);
    const userBalance = userBalanceResult.rows[0].numeric;

    const totalAmount = cost * quantity;
    if (Number(userBalance) < totalAmount) {
        throw new Error('Insufficient balance')
    }
    const query = `INSERT INTO transactions (transaction_id, user_id, transaction_type, transaction_timestamp, crypto_cost, crypto_id, quantity, total_amount)
                    VALUES (uuid_generate_v4(), $1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6) RETURNING *`;
    const values = [user.user_id, transaction_type, cost, crypto_id, Number(quantity), totalAmount];

    const newUserBalance = Number(userBalance) - totalAmount;
    try {
        const res = await pool.query(query, values);
        const transaction = res.rows[0]
        const updateBalanceQuery = 'UPDATE users SET balance = $1 WHERE user_id = $2';
        const updateBalanceValues = [newUserBalance, user.user_id];
        await pool.query(updateBalanceQuery, updateBalanceValues);
        return transaction;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}


module.exports = {
    getTransactionsForUser,
    makeTransaction
}