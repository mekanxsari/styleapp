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

    if (!title || !season1 || !outfitIds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const outfits = Array.isArray(outfitIds) ? outfitIds : [outfitIds];

    const result = await pool.query(
      `
      INSERT INTO capsulas (image_url, title, description, season_1, season_2)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [image_url, title, description || '', season1, season2]
    );

    const capsuleId = result.rows[0].id;

    const insertValues = outfits.map((_, i) => `($1, $${i + 2})`).join(', ');
    const insertParams = [capsuleId, ...outfits];

    await pool.query(
      `INSERT INTO capsulas_superset (capsulas_id, outfit_id) VALUES ${insertValues}`,
      insertParams
    );

    res.status(201).json({ message: 'Capsule created successfully', capsule_id: capsuleId });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const capsuleResult = await pool.query(
      `
      SELECT id, image_url, title, description, season_1, season_2
      FROM capsulas
      WHERE id = $1
      `,
      [id]
    );

    if (capsuleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const capsule = capsuleResult.rows[0];

    const outfitsResult = await pool.query(
      `
      SELECT o.id, o.image_url, o.title, o.season, o.label
      FROM outfits o
      JOIN capsulas_superset cs ON cs.outfit_id = o.id
      WHERE cs.capsulas_id = $1
      `,
      [id]
    );

    capsule.outfits = outfitsResult.rows;

    res.json(capsule);
  } catch (error) {
    console.error('Error fetching capsule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `DELETE FROM capsulas_superset WHERE capsulas_id = $1`,
      [id]
    );

    const result = await pool.query(
      `DELETE FROM capsulas WHERE id = $1 RETURNING image_url`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const imagePath = path.join(uploadDir, result.rows[0].image_url);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Capsule deleted successfully' });
  } catch (error) {
    console.error('Error deleting capsule:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
