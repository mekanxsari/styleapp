const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ valid: false });
  }

  const result = await pool.query(`
    SELECT id, alias, is_special FROM users
    WHERE session_token = $1 AND session_expires_at > NOW()
  `, [token]);

  if (result.rowCount === 0) {
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true, user: result.rows[0] });
});

module.exports = router;