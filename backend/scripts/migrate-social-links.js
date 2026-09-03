/**
 * One-off migration: convert the legacy fixed social settings keys
 * (facebook_url / instagram_url / twitter_url / linkedin_url) into a single
 * `social_links` JSON row that the CMS now edits (Site Settings → Social media).
 *
 * Idempotent: does nothing if `social_links` already has a value.
 */
require('dotenv').config();
const { Client } = require('pg');
const config = require('../src/config');

(async () => {
  const client = new Client({
    connectionString: config.databaseUrlPooled || config.databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    const { rows } = await client.query(
      "SELECT key, value FROM site_settings WHERE key IN ('social_links','facebook_url','instagram_url','twitter_url','linkedin_url')"
    );
    const has = rows.find((r) => r.key === 'social_links' && r.value);
    if (has) {
      console.log('social_links already present — nothing to do.');
      return;
    }
    const get = (k, fallback) => (rows.find((r) => r.key === k && r.value) || {}).value || fallback;
    const links = [
      { platform: 'Facebook', url: get('facebook_url', 'https://facebook.com') },
      { platform: 'Instagram', url: get('instagram_url', 'https://instagram.com') },
      { platform: 'X', url: get('twitter_url', 'https://x.com') },
      { platform: 'LinkedIn', url: get('linkedin_url', 'https://linkedin.com') },
    ];
    const json = JSON.stringify(links);
    await client.query(
      'INSERT INTO site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value',
      ['social_links', json]
    );
    console.log('social_links seeded:', json);
  } finally {
    await client.end();
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
