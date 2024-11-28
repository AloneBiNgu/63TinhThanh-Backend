import express from 'express';
import { signUp, signIn, logout, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('ok');
});
router.get('/check-auth', verifyToken, checkAuth);

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/logout', logout);
export default router;
