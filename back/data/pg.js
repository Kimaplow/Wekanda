const {Pool} = require('pg');
const config = require('./config');

const pool = new Pool({
    user: config.PGUSER,
    host: config.PGHOST,
    database: config.PGDATABASE,
    password: config.PGPASSWORD
});

pool.on('error', () => console.log('Lost PG connection'));

module.exports = pool;