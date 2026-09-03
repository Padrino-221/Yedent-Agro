const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const { pool } = require('./config/db');

const app = express();

// Trust Vercel's proxy headers so req.protocol/host are correct behind the CDN.
app.set('trust proxy', true);

app.use(cors());
app.use(express.json());

// Uploaded media (local dev only — ignored on Vercel; production uses Cloudinary).
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

app.use('/api/subsidiaries', require('./routes/subsidiaries'));
app.use('/api/products', require('./routes/products'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/sales-reps', require('./routes/salesReps'));
app.use('/api/awards', require('./routes/awards'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/hero-slides', require('./routes/heroSlides'));
app.use('/api/news', require('./routes/newsEvents'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Local development server. Vercel imports this module and runs it as a
// serverless function, so only listen when executed directly.
if (require.main === module) {
  const HOST = process.env.HOST || '0.0.0.0';
  app.listen(config.port, HOST, () => {
    console.log(`Yedent API running on ${HOST}:${config.port}`);
  });
}

module.exports = app;
