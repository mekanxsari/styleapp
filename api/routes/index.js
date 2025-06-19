const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');
const capculasRouter = require('./capculas');
const outfitsRouter = require('./outfits');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);
router.use('/capculas', capculasRouter);
router.use('/outfits', outfitsRouter);

module.exports = router;