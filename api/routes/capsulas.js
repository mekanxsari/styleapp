const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get("/", async (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: "Missing user ID" });
  }

  try {
    const capsulesResult = await pool.query(
      `SELECT 
        c.id,
        c.image_url,
        c.title,
        c.season,
       FROM capsulas c
       WHERE c.is_public = true
       ORDER BY c.id`
    );

    const capsules = capsulesResult.rows;

    if (capsules.length === 0) return res.json([]);

    const capsuleIds = capsules.map(c => c.id);
    const quantityResult = await pool.query(
      `SELECT capsulas_id, COUNT(outfit_id) AS quantity
       FROM capsulas_superset
       WHERE capsulas_id = ANY($1)
       GROUP BY capsulas_id`,
      [capsuleIds]
    );

    const quantityMap = {};
    quantityResult.rows.forEach(row => {
      quantityMap[row.capsulas_id] = parseInt(row.quantity);
    });

    const likedResult = await pool.query(
      `SELECT liked_id FROM users_liked 
       WHERE liked_type = 'capsulas' AND user_id = $1 AND liked_id = ANY($2)`,
      [userId, capsuleIds]
    );

    const likedSet = new Set(likedResult.rows.map(r => r.liked_id));

    const enrichedCapsules = capsules.map(c => ({
      ...c,
      quantity: quantityMap[c.id] || 0,
      liked: likedSet.has(c.id)
    }));

    res.json(enrichedCapsules);

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
