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
        eye_color,
        hair_color,
        aim_description,
        experience_description,
        wardrobe_description,
        labels_description,
        impression_description,
        brand_description,
        colors_description,
        body_description,
        outfit_description,
        budget_description
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
        eye_color,
        hair_color,
        aim_description,
        experience_description,
        wardrobe_description,
        labels_description,
        impression_description,
        brand_description,
        colors_description,
        body_description,
        outfit_description,
        budget_description
    } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: "Missing user ID in header" });
    }

    try {
        const updateResult = await pool.query(
            `UPDATE users SET
        eye_color = $1,
        hair_color = $2,
        aim_description = $3,
        experience_description = $4,
        wardrobe_description = $5,
        labels_description = $6,
        impression_description = $7,
        brand_description = $8,
        colors_description = $9,
        body_description = $10,
        outfit_description = $11,
        budget_description = $12
      WHERE id = $13
      RETURNING id`,
            [eye_color, hair_color, aim_description, experience_description, wardrobe_description, labels_description, impression_description, brand_description, colors_description, body_description, outfit_description, budget_description, userId]
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