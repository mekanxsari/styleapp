const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);

module.exports = router;