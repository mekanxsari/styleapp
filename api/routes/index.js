const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');
const capsulasRouter = require('./capsulas');
const outfitsRouter = require('./outfits');
const capsulaRouter = require('./capsula');
const outfitRouter = require('./outfit');
const clothRouter = require('./cloth');
const likesRouter = require('./likes');
const likeRouter = require('./like');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);
router.use('/capsulas', capsulasRouter);
router.use('/outfits', outfitsRouter);
router.use('/capsula', capsulaRouter);
router.use('/outfit', outfitRouter);
router.use('/cloth', clothRouter);
router.use('/likes', likesRouter);
router.use('/like', likeRouter);

module.exports = router;