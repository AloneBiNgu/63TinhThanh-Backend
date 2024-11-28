const express = require('express');
const { signUp, signIn, logout, checkAuth } = require('../controllers/auth.controller.js');
const { verifyToken } = require('../middlewares/verifyToken.js');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('ok');
});
router.get('/check-auth', verifyToken, checkAuth);

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/logout', logout);

module.exports = router;
