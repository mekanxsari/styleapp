const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

app.use('/app', express.static(path.join(__dirname, 'frontend-build')));

app.get('/', (req, res) => {
  res.redirect('/app');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
