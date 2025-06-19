const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');
const capsulasRouter = require('./capsulas');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);
route.use('/capsulas', capsulasRouter);

module.exports = router;