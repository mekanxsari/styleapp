const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page || '1');
  const limit = 20;
  const offset = (page - 1) * limit;
  const q = req.query.q || '';
  const field = req.query.field || '';

  try {
    let query = `
      SELECT id, image_url, title, category, artikul, store_name, store_url
      FROM clothes
    `;
    const values = [];

    if (q && field) {
      const allowedFields = ['id', 'title', 'category', 'artikul', 'store_name'];
      if (!allowedFields.includes(field)) {
        return res.status(400).json({ message: 'Invalid search field' });
      }

      if (field === 'id') {
        query += ' WHERE id = $1';
        values.push(parseInt(q));
      } else {
        query += ` WHERE ${field} ILIKE $1`;
        values.push(`%${q}%`);
      }
    }

    query += ' ORDER BY id LIMIT $2 OFFSET $3';
    values.push(limit, offset);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
