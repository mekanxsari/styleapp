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
    const clothQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.description,
        c.category,
        c.store_name,
        c.store_url,
        (
          SELECT COUNT(*) FROM outfits_superset os WHERE os.clothes_id = c.id
        )::INT AS outfits_quantity,
        (
          SELECT COUNT(DISTINCT cs.capsulas_id)
          FROM outfits_superset os
          JOIN capsulas_superset cs ON cs.outfit_id = os.outfit_id
          WHERE os.clothes_id = c.id
        )::INT AS capsulas_quantity,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM clothes c
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'clothes'
        AND ul.liked_id = c.id
        AND ul.user_id = $2
      WHERE c.id = $1
    `;

    const clothResult = await pool.query(clothQuery, [id, userId]);
    if (clothResult.rowCount === 0) {
      return res.status(404).json({ message: "Cloth not found" });
    }
    const cloth = clothResult.rows[0];

    const outfitsQuery = `
      SELECT 
        o.id,
        o.image_url,
        o.title,
        o.season,
        o.label,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM outfits o
      INNER JOIN outfits_superset os ON os.outfit_id = o.id
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'outfits'
        AND ul.liked_id = o.id
        AND ul.user_id = $2
      WHERE os.clothes_id = $1 AND o.is_public = true
      ORDER BY o.id
    `;
    const outfitsResult = await pool.query(outfitsQuery, [id, userId]);

    const capsulasQuery = `
      SELECT 
        c.id,
        c.image_url AS image_id,
        c.title,
        c.season_1,
        c.season_2,
        (
          SELECT COUNT(*) FROM capsulas_superset cs2 WHERE cs2.capsulas_id = c.id
        )::INT AS quantity,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM capsulas c
      INNER JOIN capsulas_superset cs ON cs.capsulas_id = c.id
      INNER JOIN outfits_superset os ON os.outfit_id = cs.outfit_id
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'capsulas'
        AND ul.liked_id = c.id
        AND ul.user_id = $2
      WHERE os.clothes_id = $1 AND c.is_public = true
      GROUP BY c.id, ul.id
      ORDER BY c.id
    `;
    const capsulasResult = await pool.query(capsulasQuery, [id, userId]);

    cloth.outfits = outfitsResult.rows;
    cloth.capsulas = capsulasResult.rows;

    res.json(cloth);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;