const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('../config');
const { requireAuth } = require('../middleware/auth');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const router = express.Router();

const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const VIDEO_MIMES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-matroska',
  'video/mpeg',
  'video/3gpp',
];

const isVideo = (mime) => VIDEO_MIMES.includes(mime);
const isAllowed = (mime) => IMAGE_MIMES.includes(mime) || VIDEO_MIMES.includes(mime);

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const video = isVideo(file.mimetype);
    return {
      folder: config.cloudinary.folder,
      resource_type: video ? 'video' : 'image',
      allowed_formats: video
        ? ['mp4', 'webm', 'ogv', 'mov', 'mkv', 'mpeg', '3gp']
        : ['jpeg', 'jpg', 'png', 'webp', 'gif', 'svg'],
      transformation: video ? [{ width: 1920, crop: 'limit' }] : [{ width: 2000, crop: 'limit' }],
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (isAllowed(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image (JPEG, PNG, WEBP, GIF, SVG) and video (MP4, WEBM, MOV, MKV) files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB (videos can be large)
});

router.post('/', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded (field name: file)' });
  }
  res.status(201).json({
    data: { url: req.file.path, filename: req.file.filename },
  });
});

module.exports = router;
