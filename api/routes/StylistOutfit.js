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

rrouter.post('/', upload.single('image'), async (req, res) => {
  console.log('------ Incoming Outfit Request ------');
  console.log('Fields:', req.body);
  console.log('File:', req.file);

  const { title, description, category, season } = req.body;
  const clothesIds = req.body['clothes[]'];

  try {
    // Debug: check if critical values are missing
    if (!req.file) {
      console.log('Missing image');
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!title || !season || !category || !clothesIds) {
      console.log('Missing fields:', { title, season, category, clothesIds });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const clothesArray = Array.isArray(clothesIds) ? clothesIds : [clothesIds];

    if (clothesArray.length < 3) {
      console.log('Not enough clothes selected:', clothesArray);
      return res.status(400).json({ message: 'At least 3 clothing items must be selected' });
    }

    console.log('Creating outfit with:', {
      title, description, category, season, image_url, clothesArray,
    });

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

    console.log('Inserting into outfits_superset with:', insertParams);

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

module.exports = router;
