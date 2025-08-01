const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: 'Missing user ID in header' });
  }

  try {
    const clothesQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.category,
        c.store_name,
        c.store_url,
        true AS liked
      FROM clothes c
      INNER JOIN users_liked ul 
        ON ul.liked_type = 'clothes'
        AND ul.liked_id = c.id
      WHERE ul.user_id = $1
      ORDER BY c.id
    `;

    const clothesResult = await pool.query(clothesQuery, [userId]);

    const outfitsQuery = `
      SELECT 
        o.id,
        o.image_url,
        o.title,
        o.season,
        o.label,
        true AS liked
      FROM outfits o
      INNER JOIN users_liked ul 
        ON ul.liked_type = 'outfits'
        AND ul.liked_id = o.id
      WHERE ul.user_id = $1
      ORDER BY o.id
    `;

    const outfitsResult = await pool.query(outfitsQuery, [userId]);

    const capsulasQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.season,
        (
          SELECT COUNT(*) FROM capsulas_superset cs WHERE cs.capsulas_id = c.id
        )::INT AS quantity,
        true AS liked
      FROM capsulas c
      INNER JOIN users_liked ul 
        ON ul.liked_type = 'capsulas'
        AND ul.liked_id = c.id
      WHERE ul.user_id = $1
      ORDER BY c.id
    `;

    const capsulasResult = await pool.query(capsulasQuery, [userId]);

    res.json({
      clothes_quantity: clothesResult.rowCount,
      outfits_quantity: outfitsResult.rowCount,
      capsulas_quantity: capsulasResult.rowCount,
      clothes: clothesResult.rows,
      outfits: outfitsResult.rows,
      capsulas: capsulasResult.rows
    });

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
