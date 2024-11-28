const express = require('express');
const { createPost, deletePost, getAllPosts, getPost, updatepost } = require('../controllers/post.controller');
const { verifyToken } = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('ok');
});

router.get('/get-post/:id', getPost);
router.get('/get-posts', getAllPosts);
router.post('/create-post', verifyToken, createPost);
router.delete('/delete-post/:id', verifyToken, deletePost);
router.put('/update-post/:id', verifyToken, updatepost);

module.exports = router;
