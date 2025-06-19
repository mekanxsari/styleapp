const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/", async (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const result = await pool.query(
      `SELECT 
          c.id,
          c.image_url,
          c.title,
          c.season_1,
          c.season_2,
          COUNT(cs.outfit_id) AS quantity,
          CASE 
            WHEN ul.id IS NOT NULL THEN true 
            ELSE false 
          END AS liked
       FROM capculas c
       LEFT JOIN capculas_superset cs 
          ON cs.capculas_id = c.id
       LEFT JOIN users_liked ul 
          ON ul.liked_type = 'capculas' 
          AND ul.liked_id = c.id 
          AND ul.user_id = $1
       GROUP BY c.id, ul.id
       ORDER BY c.id`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;