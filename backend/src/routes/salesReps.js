const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { subsidiary, all } = req.query;
    let sql = `
      SELECT sr.*, s.name AS subsidiary_name, s.slug AS subsidiary_slug
      FROM sales_representatives sr
      LEFT JOIN subsidiaries s ON sr.subsidiary_id = s.id
    `;
    const params = [];
    const conditions = [];
    if (subsidiary) {
      params.push(subsidiary);
      conditions.push(`sr.subsidiary_id = $${params.length}`);
    }
    if (all !== 'true') {
      conditions.push('sr.is_published = TRUE');
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY sr.sort_order ASC, sr.name ASC';
    const result = await query(sql, params);
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const result = await query(`
      SELECT sr.*, s.name AS subsidiary_name, s.slug AS subsidiary_slug
      FROM sales_representatives sr
      LEFT JOIN subsidiaries s ON sr.subsidiary_id = s.id
      WHERE sr.id = $1
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
      `INSERT INTO sales_representatives (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
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
      `UPDATE sales_representatives SET ${sets} WHERE id = $${keys.length + 1} RETURNING *`,
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
    const result = await query(`DELETE FROM sales_representatives WHERE id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;