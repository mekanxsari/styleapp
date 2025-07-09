const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing user ID in header" });
    }

  try {
    const result = await pool.query(`
      SELECT 
        full_name,
        birth_date,
        current_city,
        phone_number,
        email,
        profession,
        marital_status
      FROM users
      WHERE id = $1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const {
    full_name,
    birth_date,
    current_city,
    phone_number,
    email,
    profession,
    marital_status
  } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user ID in header" });
  }

  try {
    const updateResult = await pool.query(
      `UPDATE users SET
        full_name = $1,
        birth_date = $2,
        current_city = $3,
        phone_number = $4,
        email = $5,
        profession = $6,
        marital_status = $7
      WHERE id = $8
      RETURNING id`,
      [full_name, birth_date, current_city, phone_number, email, profession, marital_status, userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router