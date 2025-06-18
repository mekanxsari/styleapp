const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const apiRouter = require('./routes');
app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`✅ Backend running`);
});