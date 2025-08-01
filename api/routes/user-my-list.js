const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(400).json({ message: 'Missing user ID in header' });
  }

  try {
    const outfitsQuery = `
      SELECT 
        o.id,
        o.image_url,
        o.title,
        o.season,
        o.label,
        CASE 
          WHEN ul.id IS NOT NULL THEN true 
          ELSE false 
        END AS liked
      FROM outfits o
      INNER JOIN users_outfits uo 
        ON uo.outfit_id = o.id
      LEFT JOIN users_liked ul 
        ON ul.liked_type = 'outfits' 
        AND ul.liked_id = o.id 
        AND ul.user_id = $1
      WHERE uo.user_id = $1
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
          SELECT COUNT(*) 
          FROM capsulas_superset cs 
          WHERE cs.capsulas_id = c.id
        )::INT AS quantity,
        CASE 
          WHEN ul.id IS NOT NULL THEN true 
          ELSE false 
        END AS liked
      FROM capsulas c
      INNER JOIN users_capsulas uc 
        ON uc.capsulas_id = c.id
      LEFT JOIN users_liked ul 
        ON ul.liked_type = 'capsulas' 
        AND ul.liked_id = c.id 
        AND ul.user_id = $1
      WHERE uc.user_id = $1
      ORDER BY c.id
    `;
    const capsulasResult = await pool.query(capsulasQuery, [userId]);

    res.json({
      outfits_quantity: outfitsResult.rowCount,
      capsulas_quantity: capsulasResult.rowCount,
      outfits: outfitsResult.rows,
      capsulas: capsulasResult.rows
    });

  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;