const express = require('express');
const { Pool } = require('pg');
const app = express();

app.set('view engine', 'ejs');              // Use EJS templates
app.use(express.urlencoded({ extended: true })); // Parse form data

// PostgreSQL connection pool (configure with your DB details)
const pool = new Pool({
  user: 'youruser',
  host: 'localhost',
  database: 'yourdb',
  password: 'yourpassword',
  port: 5432,
});

// Show dashboard with clothes list
app.get('/dashboard', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clothes');
    res.render('dashboard', { clothes: result.rows });
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

// Handle add clothes form submit
app.post('/add-clothes', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.redirect('/dashboard'); // simple validation
  }
  try {
    await pool.query('INSERT INTO clothes (name) VALUES ($1)', [name]);
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send('Database error: ' + err.message);
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
