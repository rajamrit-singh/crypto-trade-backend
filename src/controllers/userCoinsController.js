const pool = require('../db/pool');

const getUserPurchasedCoins = async (userId) => {
    const query = `SELECT w.*, c.currency_name, c.currency_symbol
    FROM wallet AS w
    JOIN cryptocurrencies AS c ON w.currency_id = c.currency_id
    WHERE w.user_id = $1;`;
    const queryVal = [userId];
    try {
        const res = await pool.query(query, queryVal);
        const purchasedCoinsList = res.rows;
        console.log(purchasedCoinsList);
        return purchasedCoinsList;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    getUserPurchasedCoins
}
