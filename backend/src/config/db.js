const { Pool } = require('pg');
const config = require('../config');

const connectionString = config.databaseUrlPooled || config.databaseUrl;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  max: Number(process.env.PG_POOL_MAX || 10),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
