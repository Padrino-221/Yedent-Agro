require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  databaseUrlPooled: process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'yedent',
  },
};
