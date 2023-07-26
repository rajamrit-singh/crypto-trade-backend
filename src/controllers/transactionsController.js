const pool = require('../db/pool');
const { getCoin } = require('./coinsController');

const getTransactionsForUser = async (user_id) => {
    const query = 'SELECT * FROM transactions WHERE user_id = $1';
    const values = [user_id];
    try {
        const res = await pool.query(query, values);
        const transactionsList = res.rows;
        return transactionsList;

    } catch (error) {
        throw new Error(error);
    }
}

const getWallet = async (userId, currency_id) => {
    const walletQuery = `SELECT * FROM wallet WHERE user_id = $1 AND currency_id = $2`;
    const walletValues = [userId, currency_id];
    const walletQueryResp = await pool.query(walletQuery, walletValues);
    return walletQueryResp.rows[0];
}

const makeTransaction = async (user, crypto_id, quantity, transaction_type, req) => {
    const coinData = await getCoin(crypto_id);
    const cost = coinData.price;
    const wallet = await getWallet(user.user_id, crypto_id);
    const totalAmount = cost * quantity;
    if (transaction_type === 'buy') {
        if (totalAmount > user.balance) {
            throw new Error('Insufficient Balance');
        }
        return await makePurchaseOfCoin(user, crypto_id, quantity, wallet, cost, totalAmount);
    } else {
        if (quantity > wallet.quantity) {
            throw new Error('Insufficient coins');
        }
        return await sellCoins(user, crypto_id, quantity, wallet, cost, totalAmount);
    }
}

const sellCoins = async (user, crypto_id, quantity, wallet, cost, totalAmount) => {
    const updateTransactionQuery = `INSERT INTO transactions (transaction_id, user_id, transaction_type, transaction_timestamp, crypto_cost, crypto_id, quantity, total_amount)
    VALUES (uuid_generate_v4(), $1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6) RETURNING *`;
    const updateTransactionValues = [user.user_id, 'sell', cost, crypto_id, Number(quantity), totalAmount];

    const newUserBalance = Number(user.balance) + Number(totalAmount);
    const newQuantity = wallet.quantity - quantity;


    let updateWalletQuery = `UPDATE wallet
        SET quantity = $1
        WHERE user_id = $2 AND currency_id = $3
        RETURNING *;`;

    let updateWalletValues = [newQuantity, user.user_id, crypto_id];

    const updateBalanceQuery = 'UPDATE users SET balance = $1 WHERE user_id = $2';
    const updateBalanceValues = [newUserBalance, user.user_id];

    try {
        const res = await pool.query(updateTransactionQuery, updateTransactionValues);
        await pool.query(updateWalletQuery, updateWalletValues);
        await pool.query(updateBalanceQuery, updateBalanceValues);
        const transaction = res.rows[0];
        return transaction;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}

const makePurchaseOfCoin = async (user, crypto_id, quantity, wallet, cost, totalAmount) => {
    const updateTransactionQuery = `INSERT INTO transactions (transaction_id, user_id, transaction_type, transaction_timestamp, crypto_cost, crypto_id, quantity, total_amount)
    VALUES (uuid_generate_v4(), $1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6) RETURNING *`;
    const updateTransactionValues = [user.user_id, 'buy', cost, crypto_id, Number(quantity), totalAmount];
    // let quantity;
    const newUserBalance = user.balance - totalAmount;
    let newQuantity;
    if (wallet) {
        newQuantity = Number(wallet.quantity) + Number(quantity);
    } else {
        newQuantity = quantity;
    }
    const updateWalletQuery = `INSERT INTO wallet (user_id, currency_id, quantity)
                                VALUES ($2, $3, $1)
                                ON CONFLICT (user_id, currency_id)
                                DO UPDATE SET quantity = wallet.quantity + excluded.quantity
                                RETURNING *;`;

    const updateWalletValues = [newQuantity, user.user_id, crypto_id];
    const updateBalanceQuery = 'UPDATE users SET balance = $1 WHERE user_id = $2';
    const updateBalanceValues = [newUserBalance, user.user_id];

    try {
        const res = await pool.query(updateTransactionQuery, updateTransactionValues);
        await pool.query(updateWalletQuery, updateWalletValues);
        await pool.query(updateBalanceQuery, updateBalanceValues);
        const transaction = res.rows[0];
        return transaction;
    } catch (error) {
        console.error('Error creating transaction:', error);
    }
}

const getUserPurchasedCoins = async (user) => {
    const query = `
    SELECT DISTINCT c.*, crypto_cost,
    FROM transactions t
    INNER JOIN cryptocurrencies c ON t.crypto_id = c.currency_id
    WHERE t.user_id = $1
  `;
    const values = [user.user_id];
    try {
        const res = await pool.query(query, values);
        const coinsList = res.rows;
        return coinsList;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getTransactionsForUser,
    makeTransaction,
    getUserPurchasedCoins
}