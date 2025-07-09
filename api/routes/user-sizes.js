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
        top_size,
        bottom_size,
        shoe_size,
        shoe_description,
        height,
        chest_circumference,
        shoulder_circumference,
        waist_circumference,
        hip_circumference
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
        top_size,
        bottom_size,
        shoe_size,
        shoe_description,
        height,
        chest_circumference,
        shoulder_circumference,
        waist_circumference,
        hip_circumference
    } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing user ID in header" });
    }

    try {
        const updateResult = await pool.query(
            `UPDATE users SET
        top_size = $1,
        bottom_size = $2,
        shoe_size = $3,
        shoe_description = $4,
        height = $5,
        chest_circumference = $6,
        shoulder_circumference = $7,
        waist_circumference = $8,
        hip_circumference = $9
      WHERE id = $10
      RETURNING id`,
            [top_size, bottom_size, shoe_size, shoe_description, height, chest_circumference, shoulder_circumference, waist_circumference, hip_circumference, userId]
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