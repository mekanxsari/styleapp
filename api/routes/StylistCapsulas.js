const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || '1'));
  const limit = 20;
  const offset = (page - 1) * limit;
  const q = req.query.q || '';
  const field = req.query.field || '';

  try {
    let query = `SELECT id, image_url, title, season_1, season_2, description FROM capsulas`;
    const values = [];
    let paramIndex = 1;

    const allowedFields = ['title', 'season_1', 'season_2'];

    if (q) {
      if (field) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({ message: 'Invalid search field' });
        }
        query += ` WHERE ${field} ILIKE $${paramIndex}`;
        values.push(`%${q}%`);
        paramIndex++;
      } else {
        const conditions = allowedFields.map(f => `${f} ILIKE $${paramIndex++}`);
        query += ` WHERE ` + conditions.join(' OR ');
        allowedFields.forEach(() => values.push(`%${q}%`));
      }
    }

    query += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;