const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');
const capculasRouter = require('./capculas');
const outfitsRouter = require('./outfits');
const capculaRouter = require('./capcula');
const outfitRouter = require('./outfit');
const clothRouter = require('./cloth');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);
router.use('/capculas', capculasRouter);
router.use('/outfits', outfitsRouter);
router.use('/capcula', capculaRouter);
router.use('/outfit', outfitRouter);
router.use('/cloth', clothRouter);

module.exports = router;