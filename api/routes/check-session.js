const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/", async (req, res) => {
  const { token, user_id } = req.body;

  if (!token || !user_id) {
    return res.status(400).json({ valid: false, reason: "Missing token or user ID" });
  }

  try {
    const result = await pool.query(`
      SELECT alias FROM users
      WHERE id = $1 AND session_token = $2 AND session_expires_at > NOW()
    `, [user_id, token]);

    if (result.rowCount === 0) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user: result.rows[0] });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ valid: false, reason: 'Database error' });
  }
});

module.exports = router;