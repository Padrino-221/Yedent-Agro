const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const showAll = req.query.all === 'true';
    const result = await query(`
      SELECT hs.*, s.name AS subsidiary_name, s.slug AS subsidiary_slug
      FROM hero_slides hs
      LEFT JOIN subsidiaries s ON hs.subsidiary_id = s.id
      ${showAll ? '' : 'WHERE hs.is_published = TRUE'}
      ORDER BY hs.sort_order ASC
    `);
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT hs.*, s.name AS subsidiary_name, s.slug AS subsidiary_slug
      FROM hero_slides hs
      LEFT JOIN subsidiaries s ON hs.subsidiary_id = s.id
      WHERE hs.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await query(
      `INSERT INTO hero_slides (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE hero_slides SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM hero_slides WHERE id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;