const express = require('express');
const createCrudRoutes = require('../controllers/crud');

const router = express.Router();
createCrudRoutes(router, 'subsidiaries', { filterPublished: true });

module.exports = router;
