const express = require('express');
const createCrudRoutes = require('../controllers/crud');

const router = express.Router();
createCrudRoutes(router, 'awards', { orderBy: 'award_year DESC, sort_order ASC', filterPublished: true });

module.exports = router;
