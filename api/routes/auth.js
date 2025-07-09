const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require("uuid")
const pool = require('../db')

router.post('/', async (req, res) => {
  const { alias } = req.body

  if (!alias) {
    return res.status(400).json({ success: false, reason: "Missing alias" })
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE alias = $1", [alias])
    let user = result.rows[0]

    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    if (user) {
      await pool.query(
        "UPDATE users SET session_token = $1, session_expires_at = $2 WHERE id = $3",
        [token, expiresAt, user.id]
      )
    } else {
      const insertResult = await pool.query(
        "INSERT INTO users (alias, session_token, session_expires_at) VALUES ($1, $2, $3) RETURNING id",
        [alias, token, expiresAt]
      )
      user = insertResult.rows[0]
    }

    res.json({ success: true, token, id: user.id, hasPasscode: !!user.passcode })
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ success: false, reason: 'Database error' })
  }
})

module.exports = router