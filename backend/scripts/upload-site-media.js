/**
 * Upload the site's bundled media (frontend/public) to Cloudinary and wire
 * the hero video into the hero_slides content rows.
 *
 * Idempotent: assets that already exist under the yedent/ public_id are
 * skipped, and hero_slides.video_url is only set when empty.
 *
 * Usage:
 *   node scripts/upload-site-media.js
 *
 * Reads Cloudinary credentials and DATABASE_URL from backend/.env.
 */
require('dotenv').config();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const config = require('../src/config');
const { Client } = require('pg');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'frontend', 'public');

/** public_id (under yedent/) -> { file, resource_type } */
const ASSETS = {
  logo: { file: path.join(PUBLIC_DIR, 'yedent-logo.png'), resource_type: 'image' },
  'about-hero': { file: path.join(PUBLIC_DIR, 'about-hero.jpg'), resource_type: 'image' },
  cereal: { file: path.join(PUBLIC_DIR, 'images', 'cereal.jpg'), resource_type: 'image' },
  'grains-burlap': { file: path.join(PUBLIC_DIR, 'images', 'grains-burlap.jpg'), resource_type: 'image' },
  'maize-sacks': { file: path.join(PUBLIC_DIR, 'images', 'maize-sacks.jpg'), resource_type: 'image' },
  muesli: { file: path.join(PUBLIC_DIR, 'images', 'muesli.jpg'), resource_type: 'image' },
  poultry: { file: path.join(PUBLIC_DIR, 'images', 'poultry.jpg'), resource_type: 'image' },
  'hero-video': { file: path.join(PUBLIC_DIR, 'yedent-hero.mp4'), resource_type: 'video' },
};

const publicId = (name) => `${config.cloudinary.folder}/${name}`;

async function existingAssets() {
  const res = await cloudinary.api.resources({ type: 'upload', prefix: `${config.cloudinary.folder}/`, max_results: 100 });
  return new Set(res.resources.map((r) => r.public_id));
}

async function uploadAssets() {
  const existing = await existingAssets();
  const urls = {};
  for (const [name, asset] of Object.entries(ASSETS)) {
    const id = publicId(name);
    if (existing.has(id)) {
      const res = await cloudinary.api.resource(id, { resource_type: asset.resource_type });
      urls[name] = res.secure_url;
      console.log(`skip   ${id} (already exists)`);
      continue;
    }
    const res = await cloudinary.uploader.upload(asset.file, {
      public_id: id,
      resource_type: asset.resource_type,
      overwrite: false,
    });
    urls[name] = res.secure_url;
    console.log(`upload ${id} -> ${res.secure_url}`);
  }
  return urls;
}

async function wireHeroVideo(videoUrl) {
  const connectionString = config.databaseUrlPooled || config.databaseUrl;
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const res = await client.query(
      `UPDATE hero_slides SET video_url = $1 WHERE video_url IS NULL OR video_url = ''`,
      [videoUrl]
    );
    console.log(`hero_slides.video_url set on ${res.rowCount} slide(s)`);
  } finally {
    await client.end();
  }
}

async function main() {
  const urls = await uploadAssets();
  if (!config.cloudinary.cloudName) {
    console.error('Cloudinary credentials missing in backend/.env — aborting before DB wiring.');
    process.exit(1);
  }
  if (urls['hero-video']) {
    await wireHeroVideo(urls['hero-video']);
  } else {
    console.log('hero-video already uploaded; not touching hero_slides (already wired).');
  }
  console.log('\nCloudinary URLs:');
  for (const [name, url] of Object.entries(urls)) console.log(`  ${name}: ${url}`);
}

main().catch((err) => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
