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
  const values = [];
  let index = 1;

  if (season) {
    conditions.push(`o.season = $${index++}`);
    values.push(season);
  }

  if (label) {
    conditions.push(`o.label = $${index++}`);
    values.push(label);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const outfitQuery = `
    SELECT 
      o.id,
      o.image_url,
      o.title,
      o.description,
      o.season,
      o.label
    FROM outfits o
    ${whereClause}
    ORDER BY o.id
  `;

  try {
    const outfitResult = await pool.query(outfitQuery, values);
    const outfits = outfitResult.rows;

    if (outfits.length === 0) return res.json([]);

    const outfitIds = outfits.map(o => o.id);

    const likedResult = await pool.query(
      `SELECT liked_id FROM users_liked 
       WHERE liked_type = 'outfits' AND user_id = $1 AND liked_id = ANY($2)`,
      [userId, outfitIds]
    );

    const likedSet = new Set(likedResult.rows.map(r => r.liked_id));

    const enrichedOutfits = outfits.map(o => ({
      ...o,
      liked: likedSet.has(o.id),
    }));

    res.json(enrichedOutfits);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;