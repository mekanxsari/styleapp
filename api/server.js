const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

const apiRouter = require('./routes');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend running`);
});