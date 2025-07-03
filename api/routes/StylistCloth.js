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


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        id,
        image_url,
        title,
        description,
        category,
        artikul,
        store_name,
        store_url
      FROM clothes
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching clothing by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      DELETE FROM clothes
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    res.json({ message: "Clothing item deleted", item: result.rows[0] });
  } catch (error) {
    console.error("Error deleting clothing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    artikul,
    store_name,
    store_url
  } = req.body;

  try {
    const existing = await pool.query(`SELECT image_url FROM clothes WHERE id = $1`, [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    let image_url = existing.rows[0].image_url;

    if (req.file) {
      const oldFilePath = path.join(uploadDir, image_url);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      image_url = req.file.filename;
    }

    const result = await pool.query(`
      UPDATE clothes
      SET image_url = $1,
          title = $2,
          description = $3,
          category = $4,
          artikul = $5,
          store_name = $6,
          store_url = $7
      WHERE id = $8
      RETURNING *
    `, [image_url, title, description, category, artikul, store_name, store_url, id]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating clothing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const {
    title,
    description,
    category,
    artikul,
    store_name,
    store_url
  } = req.body;

  try {
    let image_url = null;

    if (req.file) {
      image_url = req.file.filename;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await pool.query(`
      INSERT INTO clothes (image_url, title, description, category, artikul, store_name, store_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [image_url, title, description, category, artikul, store_name, store_url]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating clothing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
