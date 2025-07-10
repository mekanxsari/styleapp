const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const pool = require('../db');

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, reason: "Missing username or password" });
  }

  try {
    const result = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, reason: "Invalid username" });
    }
    
    if (password !== user.password) {
      return res.status(401).json({ success: false, reason: "Invalid password" });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      "UPDATE admin SET session_token = $1, session_expires_at = $2 WHERE id = $3",
      [token, expiresAt, user.id]
    );

    res.json({ success: true, token, id: user.id });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, reason: 'Database error' });
  }
});

router.post("/check-session", async (req, res) => {
  const { token, user_id } = req.body;

  if (!token || !user_id) {
    return res.status(400).json({ valid: false, reason: "Missing token or user ID" });
  }

  try {
    const result = await pool.query(`
      SELECT username FROM admin
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