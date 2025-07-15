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
  const userIds = req.body['user_ids[]'] || [];
  console.log('req.body:', req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    if (!title || !season1 || !outfitIds) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const image_url = req.file.filename;
    const outfits = Array.isArray(outfitIds) ? outfitIds : [outfitIds];
    const isPublic = !userIds || userIds.length === 0;

    const insertCapsule = await pool.query(
      `INSERT INTO capsulas
         (image_url, title, description, season_1, season_2, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [image_url, title, description || '', season1, season2 || '', isPublic]
    );

    const capsuleId = insertCapsule.rows[0].id;

    const outfitPlaceholders = outfits.map((_, i) => `($1, $${i + 2})`).join(', ');
    await pool.query(
      `INSERT INTO capsulas_superset (capsulas_id, outfit_id)
       VALUES ${outfitPlaceholders}`,
      [capsuleId, ...outfits]
    );

    if (Array.isArray(userIds) && userIds.length > 0) {
      const userPlaceholders = userIds.map((_, i) => `($1, $${i + 2})`).join(', ');
      await pool.query(
        `INSERT INTO users_capsulas (capsulas_id, user_id)
         VALUES ${userPlaceholders}`,
        [capsuleId, ...userIds]
      );
    }

    res.status(201).json({
      message: 'Capsule created successfully',
      capsule_id: capsuleId
    });

  } catch (err) {
    console.error('Error creating capsule:', err);
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

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description, season1, season2 } = req.body;
  const outfitIds = req.body['outfit_ids[]'] || req.body.outfit_ids;
  const { id } = req.params;

  try {
    const existingCapsule = await pool.query(
      `SELECT image_url FROM capsulas WHERE id = $1`,
      [id]
    );

    if (existingCapsule.rows.length === 0) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    const oldImage = existingCapsule.rows[0].image_url;
    let image_url = oldImage;

    if (req.file) {
      image_url = req.file.filename;
      const oldImagePath = path.join(uploadDir, oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    await pool.query(
      `
      UPDATE capsulas
      SET image_url = $1, title = $2, description = $3, season_1 = $4, season_2 = $5
      WHERE id = $6
      `,
      [image_url, title, description || '', season1, season2, id]
    );

    if (outfitIds) {
      const outfits = Array.isArray(outfitIds) ? outfitIds : [outfitIds];

      await pool.query(`DELETE FROM capsulas_superset WHERE capsulas_id = $1`, [id]);

      const insertValues = outfits.map((_, i) => `($1, $${i + 2})`).join(', ');
      const insertParams = [id, ...outfits];

      await pool.query(
        `INSERT INTO capsulas_superset (capsulas_id, outfit_id) VALUES ${insertValues}`,
        insertParams
      );
    }

    res.json({ message: 'Capsule updated successfully' });
  } catch (err) {
    console.error('Error updating capsule:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
