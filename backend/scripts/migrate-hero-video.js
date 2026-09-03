/**
 * One-off migration: add hero_slides.video_url for production video support.
 * Idempotent — safe to run more than once.
 * Usage: node scripts/migrate-hero-video.js
 */
require('dotenv').config();
const { Client } = require('pg');

const conn = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;

async function main() {
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('ALTER TABLE hero_slides ADD COLUMN IF NOT EXISTS video_url TEXT');
    const cols = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name='hero_slides' AND column_name='video_url'"
    );
    console.log('hero_slides.video_url present:', cols.rows.length > 0);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Migration failed:', e.message);
  process.exit(1);
});
