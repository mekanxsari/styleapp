const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        id,
        image_url,
        title,
        descripiton,
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { image_url, title, descripiton, category, artikul, store_name, store_url } = req.body;

  try {
    const result = await pool.query(`
      UPDATE clothes
      SET image_url = $1,
          title = $2,
          descripiton = $3,
          category = $4,
          artikul = $5,
          store_name = $6,
          store_url = $7
      WHERE id = $8
      RETURNING *
    `, [image_url, title, descripiton, category, artikul, store_name, store_url, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    res.json({ message: "Clothing item updated", item: result.rows[0] });
  } catch (error) {
    console.error("Error updating clothing:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
