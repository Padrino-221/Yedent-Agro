const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query('SELECT key, value FROM site_settings');
    const settings = {};
    result.rows.forEach((r) => { settings[r.key] = r.value; });
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
});

router.put('/', requireAuth, async (req, res, next) => {
  try {
    const entries = Object.entries(req.body);
    for (const [key, value] of entries) {
      await query(
        `INSERT INTO site_settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      );
    }
    const result = await query('SELECT key, value FROM site_settings');
    const settings = {};
    result.rows.forEach((r) => { settings[r.key] = r.value; });
    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
