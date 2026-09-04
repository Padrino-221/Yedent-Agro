const express = require('express');
const createCrudRoutes = require('../controllers/crud');

const router = express.Router();
createCrudRoutes(router, 'leaders', { orderBy: 'sort_order ASC', filterPublished: true });

module.exports = router;