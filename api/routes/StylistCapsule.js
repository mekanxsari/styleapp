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
  console.log('--- Incoming POST /capsules request ---');
  console.log('Body:', req.body);
  console.log('File:', req.file);

  const { title, description, season1, season2 } = req.body;
  const outfitIds = req.body['outfit_ids[]'] || req.body.outfit_ids;

  console.log('Parsed Fields:');
  console.log('  title:', title);
  console.log('  description:', description);
  console.log('  season1:', season1);
  console.log('  season2:', season2);
  console.log('  outfitIds:', outfitIds);

  try {
    if (!req.file) {
      console.log('❌ Image file missing');
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!title || !season1 || !outfitIds) {
      console.log('❌ Required fields missing:', {
        title,
        season1,
        outfitIds,
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const outfits = Array.isArray(outfitIds) ? outfitIds : [outfitIds];
    console.log('Processed outfit IDs array:', outfits);

    const result = await pool.query(
      `
      INSERT INTO capsulas (image_url, title, description, season1, season2)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [image_url, title, description || '', season1, season2]
    );

    const capsuleId = result.rows[0].id;
    console.log('✅ Capsule created with ID:', capsuleId);

    const insertValues = outfits.map((_, i) => `($1, $${i + 2})`).join(', ');
    const insertParams = [capsuleId, ...outfits];
    console.log('Insert outfit linkage values:', insertValues);
    console.log('Insert outfit linkage params:', insertParams);

    await pool.query(
      `INSERT INTO capsulas_superset (capsulas_id, outfit_id) VALUES ${insertValues}`,
      insertParams
    );

    console.log('✅ Capsule outfits linked successfully');

    res.status(201).json({ message: 'Capsule created successfully', capsule_id: capsuleId });
  } catch (err) {
    console.error('❌ Error creating capsule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
