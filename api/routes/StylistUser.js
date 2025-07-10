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

router.get('/single/view/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const query = `
      SELECT 
        id, alias, session_token, session_expires_at, full_name, birth_date, current_city, phone_number, email, 
        profession, marital_status, top_size, bottom_size, shoe_size, shoe_description, height, chest_circumference, 
        shoulder_circumference, waist_circumference, hip_circumference, eye_color, hair_color, aim_description, 
        experience_description, wardrobe_description, labels_description, impression_description, brand_description, 
        colors_description, body_description, outfit_description, budget_description, passcode
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/single/update-passcode/:id', async (req, res) => {
  const userId = req.params.id;
  const { passcode } = req.body;

  if (!passcode) {
    return res.status(400).json({ message: 'Passcode is required' });
  }

  try {
    const query = `
      UPDATE users
      SET passcode = $1
      WHERE id = $2
      RETURNING id, passcode
    `;

    const result = await pool.query(query, [passcode, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Passcode updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
