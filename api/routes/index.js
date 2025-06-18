const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');

router.use(authRouter);
router.use(checkSessionRouter);

module.exports = router;