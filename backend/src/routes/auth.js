const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const config = require('../config');
const { requireAuth, requireGroupAdmin } = require('../middleware/auth');

const router = express.Router();

// List all admin users (group admin only)
router.get('/users', requireAuth, requireGroupAdmin, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, full_name, email, role, department_id, is_active, created_at
       FROM users ORDER BY created_at ASC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

router.post('/register', requireAuth, requireGroupAdmin, async (req, res, next) => {
  try {
    const { full_name, email, password, role = 'dept_admin', department_id } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'full_name, email and password are required' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (full_name, email, password_hash, role, department_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, department_id`,
      [full_name, email, password_hash, role, department_id]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email already exists' });
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    res.json({
      data: {
        token,
        user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update a user (full_name, role, department_id, is_active, optional password reset)
router.put('/users/:id', requireAuth, requireGroupAdmin, async (req, res, next) => {
  try {
    const { full_name, role, department_id, is_active, password } = req.body;
    if (full_name === undefined && role === undefined && department_id === undefined && is_active === undefined && password === undefined) {
      return res.status(400).json({ error: 'Nothing to update' });
    }
    const sets = [];
    const params = [];
    if (full_name !== undefined) {
      params.push(full_name);
      sets.push(`full_name = $${params.length}`);
    }
    if (role !== undefined) {
      params.push(role);
      sets.push(`role = $${params.length}`);
    }
    if (department_id !== undefined) {
      params.push(department_id);
      sets.push(`department_id = $${params.length}`);
    }
    if (is_active !== undefined) {
      params.push(is_active);
      sets.push(`is_active = $${params.length}`);
    }
    if (password !== undefined && password !== '') {
      params.push(await bcrypt.hash(password, 10));
      sets.push(`password_hash = $${params.length}`);
    }
    params.push(req.params.id);
    const result = await query(
      `UPDATE users SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $${params.length}
       RETURNING id, full_name, email, role, department_id, is_active`,
      params
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', requireAuth, requireGroupAdmin, async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    const result = await query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ data: req.user });
});

module.exports = router;