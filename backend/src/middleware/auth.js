const jwt = require('jsonwebtoken');
const config = require('../config');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authentication required' });
    if (req.user.role !== role && req.user.role !== 'group_admin') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

function requireGroupAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Authentication required' });
  if (req.user.role !== 'group_admin') {
    return res.status(403).json({ error: 'Group admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireRole, requireGroupAdmin };
