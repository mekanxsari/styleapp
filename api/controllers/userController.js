const pool = require('../db');

exports.getAllUsers = async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
