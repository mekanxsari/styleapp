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
  const { title, description, category, season, userAliases } = req.body;
  const clothesIds = req.body.clothesIds;

  const aliasArray = userAliases
    ? Array.isArray(userAliases)
      ? userAliases
      : [userAliases]
    : [];
  const isPublic = aliasArray.length === 0;

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
      INSERT INTO outfits (image_url, title, description, season, label, is_public)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [image_url, title, description, season, category, isPublic]
    );

    const outfitId = result.rows[0].id;

    if (!isPublic) {
      const aliasesArray = Array.isArray(userAliases) ? userAliases : [userAliases];
      const usersResult = await pool.query(
        `SELECT id FROM users WHERE alias = ANY($1::text[])`,
        [aliasesArray]
      );

      const userIds = usersResult.rows.map(row => row.id);

      if (userIds.length > 0) {
        const values = userIds.map((_, idx) => `($1, $${idx + 2})`).join(', ');
        const params = [outfitId, ...userIds];
        await pool.query(
          `INSERT INTO users_outfits (outfit_id, user_id) VALUES ${values}`,
          params
        );
      }
    }


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

router.put('/:id', upload.single('image'), async (req, res) => {
  const outfitId = req.params.id;
  const { title, description, category, season } = req.body;

  try {
    if (!title || !season || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const outfitResult = await pool.query(
      'SELECT image_url FROM outfits WHERE id = $1',
      [outfitId]
    );

    if (outfitResult.rows.length === 0) {
      return res.status(404).json({ message: 'Outfit not found' });
    }

    const oldImageUrl = outfitResult.rows[0].image_url;
    let newImageUrl = oldImageUrl;

    if (req.file) {
      newImageUrl = req.file.filename;
      const oldFilePath = path.join(uploadDir, oldImageUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await pool.query(
      `
      UPDATE outfits
      SET image_url = $1,
          title = $2,
          description = $3,
          season = $4,
          label = $5
      WHERE id = $6
      `,
      [newImageUrl, title, description, season, category, outfitId]
    );

    res.json({ message: 'Outfit updated successfully', outfit_id: outfitId });
  } catch (error) {
    console.error('Error updating outfit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
