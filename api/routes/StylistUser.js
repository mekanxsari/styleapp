const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, alias, full_name, current_city, passcode
      FROM users
      ORDER BY id
    `;
    const result = await pool.query(query);
    res.json(result.rows);  
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
