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
  const { title, description, category, season } = req.body;
  const clothesIds = req.body.clothesIds;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!title || !season || !category || !clothesIds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const clothesArray = Array.isArray(clothesIds) ? clothesIds : [clothesIds];

    const result = await pool.query(
      `
      INSERT INTO outfits (image_url, title, description, season, label)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [image_url, title, description, season, category]
    );

    const outfitId = result.rows[0].id;

    const insertValues = clothesArray.map((_, idx) => `($1, $${idx + 2})`).join(', ');
    const insertParams = [outfitId, ...clothesArray];

    await pool.query(
      `INSERT INTO outfits_superset (outfit_id, clothes_id) VALUES ${insertValues}`,
      insertParams
    );

    res.status(201).json({ message: 'Outfit created successfully', outfit_id: outfitId });
  } catch (error) {
    console.error('Error creating outfit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const outfitId = req.params.id;
  try {
    // Get outfit details
    const outfitResult = await pool.query(
      'SELECT * FROM outfits WHERE id = $1',
      [outfitId]
    );

    if (outfitResult.rows.length === 0) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    const outfit = outfitResult.rows[0];

    const clothesResult = await pool.query(
      `
      SELECT c.*
      FROM clothes c
      JOIN outfits_superset os ON c.id = os.clothes_id
      WHERE os.outfit_id = $1
      `,
      [outfitId]
    );

    outfit.clothes = clothesResult.rows;

    res.json(outfit);
  } catch (error) {
    console.error('Error fetching outfit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const outfitId = req.params.id;

  try {
    const outfitResult = await pool.query(
      'SELECT image_url FROM outfits WHERE id = $1',
      [outfitId]
    );

    if (outfitResult.rows.length === 0) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    const imageUrl = outfitResult.rows[0].image_url;

    await pool.query('DELETE FROM outfits_superset WHERE outfit_id = $1', [outfitId]);

    await pool.query('DELETE FROM outfits WHERE id = $1', [outfitId]);

    const filePath = path.join(uploadDir, imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Outfit deleted successfully' });
  } catch (error) {
    console.error('Error deleting outfit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
