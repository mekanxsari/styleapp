const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/:id', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { id } = req.params;
  const { type } = req.body;

  if (!userId || !type) {
    return res.status(400).json({ message: 'Missing user ID or type' });
  }

  try {
    await pool.query(
      `INSERT INTO users_liked (user_id, liked_type, liked_id)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING`,
      [userId, type, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.headers['x-user-id'];
  const { id } = req.params;
  const { type } = req.body;

  if (!userId || !type) {
    return res.status(400).json({ message: 'Missing user ID or type' });
  }

  try {
    await pool.query(
      `DELETE FROM users_liked
       WHERE user_id = $1 AND liked_type = $2 AND liked_id = $3`,
      [userId, type, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Dislike error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
