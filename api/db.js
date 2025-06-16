// db.js
const { Pool } = require('pg');
const pool = new Pool(); // uses values from .env
module.exports = pool;
