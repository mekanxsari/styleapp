const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        image_url,
        title,
        category,
        artikul,
        store_name,
        store_url
      FROM clothes
      ORDER BY id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;