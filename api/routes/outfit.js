const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID in header" });
  }

  try {
    const outfitQuery = `
      SELECT 
        o.id,
        o.image_url AS image_id,
        o.title,
        o.description,
        o.season,
        o.label,
        COUNT(os.clothes_id)::INT AS quantity,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM outfits o
      LEFT JOIN outfits_superset os ON os.outfit_id = o.id
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'outfits'
        AND ul.liked_id = o.id
        AND ul.user_id = $2
      WHERE o.id = $1
      GROUP BY o.id, ul.id
    `;

    const outfitResult = await pool.query(outfitQuery, [id, userId]);

    if (outfitResult.rowCount === 0) {
      return res.status(404).json({ message: "Outfit not found" });
    }
    const outfit = outfitResult.rows[0];

    const clothesQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.category,
        c.store_name,
        c.store_url,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM clothes c
      INNER JOIN outfits_superset os ON os.clothes_id = c.id
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'clothes'
        AND ul.liked_id = c.id
        AND ul.user_id = $2
      WHERE os.outfit_id = $1
      ORDER BY c.id
    `;

    const clothesResult = await pool.query(clothesQuery, [id, userId]);
    outfit.clothes = clothesResult.rows;

    res.json(outfit);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;