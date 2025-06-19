const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const querystring = require("querystring");
const pool = require('../db');

const BOT_TOKEN = '7720170640:AAGfd0fHPPM8z6AyoEZlDDfZpn0OuWaBkb4';

function verifyTelegramInitData(initData) {
  const secretKey = crypto
    .createHash('sha256')
    .update(BOT_TOKEN)
    .digest();

  const parsed = querystring.parse(initData);
  const receivedHash = parsed.hash;
  delete parsed.hash;

  const dataCheckString = Object.keys(parsed)
    .sort()
    .map(key => `${key}=${parsed[key]}`)
    .join('\n');

  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return hmac === receivedHash ? parsed : null;
}

router.post("/", async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, reason: "Missing initData" });
  }

  const parsed = verifyTelegramInitData(initData);

  if (!parsed) {
    return res.status(403).json({ success: false, reason: "Invalid Telegram signature" });
  }

  let userInfo;
  try {
    userInfo = JSON.parse(parsed.user);
  } catch {
    return res.status(400).json({ success: false, reason: "Malformed user info" });
  }

  const alias = userInfo.username;
  if (!alias) {
    return res.status(400).json({ success: false, reason: "Username (alias) not set on Telegram" });
  }

  const result = await pool.query("SELECT * FROM users WHERE alias = $1", [alias]);
  let user = result.rows[0];

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (user) {
    await pool.query(
      "UPDATE users SET session_token = $1, session_expires_at = $2 WHERE id = $3",
      [token, expiresAt, user.id]
    );
  } else {
    const insertResult = await pool.query(
      "INSERT INTO users (alias, session_token, session_expires_at) VALUES ($1, $2, $3) RETURNING id",
      [alias, token, expiresAt]
    );
    user = insertResult.rows[0];
  }

  return res.json({ success: true, token, id: user.id });
});

module.exports = router;