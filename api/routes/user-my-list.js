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
        o.label
      FROM outfits o
      INNER JOIN users_outfits uo 
        ON uo.outfit_id = o.id
      WHERE uo.user_id = $1
      ORDER BY o.id
    `;
    const outfitsResult = await pool.query(outfitsQuery, [userId]);

    const capsulasQuery = `
      SELECT 
        c.id,
        c.image_url,
        c.title,
        c.season_1,
        c.season_2,
        (
          SELECT COUNT(*) 
          FROM capsulas_superset cs 
          WHERE cs.capsulas_id = c.id
        )::INT AS quantity
      FROM capsulas c
      INNER JOIN users_capsulas uc 
        ON uc.capsulas_id = c.id
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
