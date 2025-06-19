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
    const capsuleQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.description,
        c.season_1,
        c.season_2,
        COUNT(cs.outfit_id) AS quantity,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM capsulas c
      LEFT JOIN capsulas_superset cs ON cs.capsulas_id = c.id
      LEFT JOIN users_liked ul 
        ON ul.liked_type = 'capsulas' 
        AND ul.liked_id = c.id 
        AND ul.user_id = $2
      WHERE c.id = $1
      GROUP BY c.id, ul.id
    `;

    const capsuleResult = await pool.query(capsuleQuery, [id, userId]);
    if (capsuleResult.rowCount === 0) {
      return res.status(404).json({ message: "Capsula not found" });
    }
    const capsule = capsuleResult.rows[0];

    const outfitsQuery = `
      SELECT 
        o.id,
        o.image_url AS image_id,
        o.title,
        o.season,
        o.label,
        CASE WHEN ul.id IS NOT NULL THEN true ELSE false END AS liked
      FROM outfits o
      INNER JOIN capsulas_superset cs ON cs.outfit_id = o.id
      LEFT JOIN users_liked ul
        ON ul.liked_type = 'outfits'
        AND ul.liked_id = o.id
        AND ul.user_id = $2
      WHERE cs.capsulas_id = $1
      ORDER BY o.id
    `;

    const outfitsResult = await pool.query(outfitsQuery, [id, userId]);

    capsule.outfits = outfitsResult.rows;

    res.json(capsule);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
