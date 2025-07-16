const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', '..', 'app-images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const hash = crypto.randomBytes(4).toString('hex');
    cb(null, `${hash}${ext}`);
  },
});

const upload = multer({ storage });

router.post('/', upload.array('images', 10), async (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: 'Missing user_id' });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'Images are required' });
  }

  try {
    await pool.query('BEGIN');

    const inserted = [];

    for (const file of req.files) {
      const imageUrl = file.filename;

      const result = await pool.query(
        `INSERT INTO user_images (user_id, image_url) VALUES ($1, $2) RETURNING *`,
        [userId, imageUrl]
      );

      inserted.push(result.rows[0]);
    }

    await pool.query('COMMIT');

    res.status(201).json({ success: true, images: inserted });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;