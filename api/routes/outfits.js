const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/", async (req, res) => {
  const userId = req.headers['x-user-id'];
  const season = req.query.season;
  const label = req.query.label;

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  const conditions = ['o.is_public = true'];
  const values = [userId];
  let index = 2;

  if (season) {
    conditions.push(`o.season = $${index++}`);
    values.push(season);
  }

  if (label) {
    conditions.push(`o.label = $${index++}`);
    values.push(label);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT 
        o.id,
        o.image_url,
        o.title,
        o.description,
        o.season,
        o.label,
        CASE 
          WHEN ul.id IS NOT NULL THEN true 
          ELSE false 
        END AS liked
     FROM outfits o
     LEFT JOIN users_liked ul 
        ON ul.liked_type = 'outfits' 
        AND ul.liked_id = o.id 
        AND ul.user_id = $1
     ${whereClause}
     ORDER BY o.id
  `;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;