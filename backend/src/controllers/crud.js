const { query } = require('../config/db');
const { requireAuth } = require('../middleware/auth');

function createCrudRoutes(router, table, options = {}) {
  const {
    allowedColumns = ['*'],
    orderBy = 'sort_order ASC',
    idColumn = 'id',
    filterPublished = false, // when true, hide is_published = FALSE unless ?all=true
  } = options;

  router.get('/', async (req, res, next) => {
    try {
      const showAll = req.query.all === 'true';
      let sql = `SELECT ${allowedColumns.join(', ')} FROM ${table}`;
      if (filterPublished && !showAll) {
        sql += ' WHERE is_published = TRUE';
      }
      sql += ` ORDER BY ${orderBy}`;
      const result = await query(sql);
      res.json({ data: result.rows });
    } catch (err) {
      next(err);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await query(`SELECT ${allowedColumns.join(', ')} FROM ${table} WHERE ${idColumn} = $1`, [req.params.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
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
        `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
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
        `UPDATE ${table} SET ${sets} WHERE ${idColumn} = $${keys.length + 1} RETURNING *`,
        [...values, req.params.id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', requireAuth, async (req, res, next) => {
    try {
      const result = await query(`DELETE FROM ${table} WHERE ${idColumn} = $1`, [req.params.id]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });
}

module.exports = createCrudRoutes;