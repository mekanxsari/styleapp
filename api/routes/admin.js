const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all clothes
router.get('/clothes', async (req, res) => {
  const result = await db.query('SELECT clothes.*, images.url AS image_url FROM clothes LEFT JOIN images ON clothes.image_id = images.id');
  res.json(result.rows);
});

// Add a new clothing item
router.post('/clothes', async (req, res) => {
  const { name, type, description, store, link, image_id } = req.body;
  await db.query(
    'INSERT INTO clothes (name, type, description, store, link, image_id) VALUES ($1, $2, $3, $4, $5, $6)',
    [name, type, description, store, link, image_id]
  );
  res.sendStatus(201);
});

// Update an item
router.put('/clothes/:id', async (req, res) => {
  const id = req.params.id;
  const { name, type, description, store, link, image_id } = req.body;
  await db.query(
    'UPDATE clothes SET name = $1, type = $2, description = $3, store = $4, link = $5, image_id = $6 WHERE id = $7',
    [name, type, description, store, link, image_id, id]
  );
  res.sendStatus(200);
});

// Delete an item
router.delete('/clothes/:id', async (req, res) => {
  await db.query('DELETE FROM clothes WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
