// Vercel serverless entry point.
// Vercel routes all requests to this function (see vercel.json), which
// re-exports the Express app from src/index.js. `require.main` is this
// module on Vercel, so src/index.js never starts its own listener.
const app = require('../src/index');

module.exports = app;