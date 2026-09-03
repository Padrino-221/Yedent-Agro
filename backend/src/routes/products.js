const express = require('express');
const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

async function getProductWithDetails(id) {
  const productResult = await query('SELECT * FROM products WHERE id = $1', [id]);
  if (productResult.rows.length === 0) return null;
  const product = productResult.rows[0];

  const [nutritionResult, imagesResult, stepsResult, subsidiaryResult, videosResult] = await Promise.all([
    query('SELECT nutrient, value, unit, category, sort_order FROM product_nutrition WHERE product_id = $1 ORDER BY sort_order ASC', [id]),
    query('SELECT image_url, caption, sort_order FROM product_images WHERE product_id = $1 ORDER BY sort_order ASC', [id]),
    query('SELECT step_number, instruction FROM product_preparation_steps WHERE product_id = $1 ORDER BY step_number ASC', [id]),
    query('SELECT id, name, slug FROM subsidiaries WHERE id = $1', [product.subsidiary_id]),
    query('SELECT video_url, title, sort_order FROM product_videos WHERE product_id = $1 ORDER BY sort_order ASC', [id]),
  ]);

  product.nutrition = nutritionResult.rows;
  product.images = imagesResult.rows;
  product.preparation_steps = stepsResult.rows;
  product.subsidiary = subsidiaryResult.rows[0] || null;
  product.videos = videosResult.rows;

  delete product.subsidiary_id;
  return product;
}

async function replaceNestedData(productId, { nutrition = [], images = [], preparation_steps = [], videos = [] }) {
  await query('DELETE FROM product_nutrition WHERE product_id = $1', [productId]);
  await query('DELETE FROM product_images WHERE product_id = $1', [productId]);
  await query('DELETE FROM product_preparation_steps WHERE product_id = $1', [productId]);
  await query('DELETE FROM product_videos WHERE product_id = $1', [productId]);

  for (const [i, n] of nutrition.entries()) {
    await query(
      `INSERT INTO product_nutrition (product_id, nutrient, value, unit, category, sort_order) VALUES ($1,$2,$3,$4,$5,$6)`,
      [productId, n.nutrient, n.value, n.unit, n.category, n.sort_order ?? i]
    );
  }
  for (const [i, img] of images.entries()) {
    await query(
      `INSERT INTO product_images (product_id, image_url, caption, sort_order) VALUES ($1,$2,$3,$4)`,
      [productId, img.image_url, img.caption, img.sort_order ?? i]
    );
  }
  for (const [i, s] of preparation_steps.entries()) {
    await query(
      `INSERT INTO product_preparation_steps (product_id, step_number, instruction) VALUES ($1,$2,$3)`,
      [productId, s.step_number ?? i + 1, s.instruction]
    );
  }
  for (const [i, v] of videos.entries()) {
    await query(
      `INSERT INTO product_videos (product_id, video_url, title, sort_order) VALUES ($1,$2,$3,$4)`,
      [productId, v.video_url, v.title, v.sort_order ?? i]
    );
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { sector, subsidiary, all } = req.query;
    let sql = `
      SELECT p.*, s.name AS subsidiary_name, s.slug AS subsidiary_slug
      FROM products p
      LEFT JOIN subsidiaries s ON p.subsidiary_id = s.id
    `;
    const params = [];
    const conditions = [];
    if (all !== 'true') {
      conditions.push('p.is_published = TRUE');
    }
    if (sector) {
      params.push(sector);
      conditions.push(`p.sector = $${params.length}`);
    }
    if (subsidiary) {
      params.push(subsidiary);
      conditions.push(`p.subsidiary_id = $${params.length}`);
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY p.sort_order ASC, p.name ASC';
    const result = await query(sql, params);
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await getProductWithDetails(req.params.id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { nutrition = [], images = [], preparation_steps = [], videos = [], ...fields } = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const insertResult = await query(
      `INSERT INTO products (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    const id = insertResult.rows[0].id;

    await replaceNestedData(id, { nutrition, images, preparation_steps, videos });

    const product = await getProductWithDetails(id);
    res.status(201).json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { nutrition = [], images = [], preparation_steps = [], videos = [], ...fields } = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const result = await query(
      `UPDATE products SET ${sets} WHERE id = $${keys.length + 1} RETURNING id`,
      [...values, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    await replaceNestedData(req.params.id, { nutrition, images, preparation_steps, videos });

    const product = await getProductWithDetails(req.params.id);
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;