require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routers
const userRoutes = require('./routes/userRoutes');
// Add more as needed
// const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
