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
    const hash = crypto.randomBytes(3).toString('hex');
    cb(null, `${hash}${ext}`);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, season1, season2 } = req.body;
  const outfitIds = req.body['outfit_ids[]'] || req.body.outfit_ids;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!title || !season1 || !season2 || !outfitIds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const outfits = Array.isArray(outfitIds) ? outfitIds : [outfitIds];

    const result = await pool.query(
      `
      INSERT INTO capsules (image_url, title, description, season1, season2)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [image_url, title, description || '', season1, season2]
    );

    const capsuleId = result.rows[0].id;

    const insertValues = outfits.map((_, i) => `($1, $${i + 2})`).join(', ');
    const insertParams = [capsuleId, ...outfits];

    await pool.query(
      `INSERT INTO capsules_outfits (capsule_id, outfit_id) VALUES ${insertValues}`,
      insertParams
    );

    res.status(201).json({ message: 'Capsule created successfully', capsule_id: capsuleId });
  } catch (err) {
    console.error('Error creating capsule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
