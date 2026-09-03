/**
 * Apply schema + seed to a remote PostgreSQL (e.g. Neon).
 *
 * The existing scripts/setup-db.js assumes local psql and tries to CREATE
 * DATABASE, which does not apply to Neon's managed service (the database is
 * already provisioned in the connection string). This script instead runs the
 * idempotent schema.sql and seed.sql directly against the configured database.
 *
 * Usage:
 *   node scripts/setup-neon.js
 *
 * Reads DATABASE_URL_POOLED (or DATABASE_URL) from backend/.env.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL (or DATABASE_URL_POOLED) is not set. Create backend/.env first.');
  process.exit(1);
}

const db = (name) => path.join(__dirname, '..', 'src', 'db', name);

async function runSql(client, file, label) {
  const sql = fs.readFileSync(file, 'utf8');
  console.log(`Applying ${label} (${path.basename(file)}) ...`);
  await client.query(sql);
  console.log(`  ${label} applied.`);
}

async function main() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await runSql(client, db('schema.sql'), 'schema');
    await runSql(client, db('seed.sql'), 'seed');
    console.log('Database setup complete.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Database setup failed:', err.message);
  process.exit(1);
});
