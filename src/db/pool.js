const { Pool } = require('pg');
const config = require('../../config');

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port, //port number that postgresql server is running on
});

module.exports = pool;
