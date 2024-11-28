import express from 'express';
import { createPost, deletePost, getAllPosts, getPost, updatepost } from '../controllers/post.controller.js';
import { checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/', (req, res) => {
	res.send('ok');
});

router.get('/get-post/:id', getPost);
router.get('/get-posts', getAllPosts);
router.post('/create-post', verifyToken, createPost);
router.delete('/delete-post/:id', verifyToken, deletePost);
router.put('/update-post/:id', verifyToken, updatepost);

export default router;
