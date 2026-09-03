const express = require('express');
const createCrudRoutes = require('../controllers/crud');

const router = express.Router();
createCrudRoutes(router, 'partners', { orderBy: 'sort_order ASC', filterPublished: true });

module.exports = router;
