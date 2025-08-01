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
    let query = `SELECT id, image_url, title, season, description FROM capsulas`;
    const values = [];
    let idx = 1;

    const allowedFields = ['title', 'season'];

    if (q) {
      if (field) {
        if (!allowedFields.includes(field)) {
          return res.status(400).json({ message: 'Invalid search field' });
        }

        query += ` WHERE ${field} ILIKE $${idx}`;
        values.push(`%${q}%`);
        idx++;
      } else {
        query += ` WHERE (title ILIKE $${idx} OR season ILIKE $${idx + 1})`;
        values.push(`%${q}%`, `%${q}%`);
        idx += 2;
      }
    }

    query += ` ORDER BY id LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;