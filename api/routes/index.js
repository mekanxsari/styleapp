const express = require('express');
const router = express.Router();

//USER INTERFACE API
const authRouter = require('./auth');
const checkSessionRouter = require('./check-session');
const verifyPassCode = require('./verify-passcode');
const capsulasRouter = require('./capsulas');
const outfitsRouter = require('./outfits');
const capsulaRouter = require('./capsula');
const outfitRouter = require('./outfit');
const clothRouter = require('./cloth');
const likesRouter = require('./likes');
const likeRouter = require('./like');

router.use('/auth', authRouter);
router.use('/check-session', checkSessionRouter);
router.use('/verify-passcode', verifyPassCode);
router.use('/capsulas', capsulasRouter);
router.use('/outfits', outfitsRouter);
router.use('/capsula', capsulaRouter);
router.use('/outfit', outfitRouter);
router.use('/cloth', clothRouter);
router.use('/likes', likesRouter);
router.use('/like', likeRouter);


//STYLIST DASHBOARD API
const authStylistRouter = require('./stylist-auth');
const clothesStylistRouter = require('./StylistClothes');
const clothStylistRouter = require('./StylistCloth');
const outfitStylistRouter = require('./StylistOutfit');
const outfitsStylistRouter = require('./StylistOutfits');
const capsuleStylistRouter = require('./StylistCapsule');
const capsulasStylistRouter = require('./StylistCapsulas');

router.use('/stylist-auth', authStylistRouter);
router.use('/stylist-clothes', clothesStylistRouter);
router.use('/stylist-cloth', clothStylistRouter);
router.use('/stylist-outfit', outfitStylistRouter);
router.use('/stylist-outfits', outfitsStylistRouter);
router.use('/stylist-capsule', capsuleStylistRouter);
router.use('/stylist-capsulas', capsulasStylistRouter);

module.exports = router;