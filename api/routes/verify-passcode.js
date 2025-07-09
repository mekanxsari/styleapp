const express = require('express')
const router = express.Router()
const pool = require('../db')

router.post('/verify-passcode', async (req, res) => {
  const { id, token, passcode } = req.body

  if (!id || !token || !passcode) {
    return res.status(400).json({ success: false, reason: 'Missing fields' })
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND session_token = $2",
      [id, token]
    )

    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ success: false, reason: 'Invalid session' })
    }

    if (user.passcode !== passcode) {
      return res.status(401).json({ success: false, reason: 'Wrong passcode' })
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ success: false, reason: 'DB error' })
  }
})

module.exports = router