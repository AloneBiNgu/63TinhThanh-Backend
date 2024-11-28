const Post = require('../models/post.model.js');

const createPost = async (req, res) => {
	const { title, description, content } = req.body;
	try {
		if (!title || !description || !content) {
			return res.status(200).json({ success: false, message: 'All fields are required' });
		}

		const post = new Post({ title, description, content, author: req.userId });
		await post.save();

		res.status(201).json({
			success: true,
			message: 'Post created successfully',
			post: { ...post._doc },
		});
	} catch (error) {
		console.error('Create post error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
const deletePost = async (req, res) => {
	try {
		await Post.findByIdAndDelete(req.params.id).exec();

		res.status(200).json({
			success: true,
			message: 'Post deleted successfully',
		});
	} catch (error) {
		console.error('Create post error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
const updatePost = async (req, res) => {
	try {
		const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean().exec();

		res.status(200).json({
			success: true,
			message: 'Post updated successfully',
			post,
		});
	} catch (error) {
		console.error('Create post error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find({}).populate('author', 'name').select('title description content createdAt').lean().exec();

		res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		console.error('Create post error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
const getPost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id).lean().exec();

		res.status(200).json({
			success: true,
			post,
		});
	} catch (error) {
		console.error('Create post error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	createPost,
	deletePost,
	updatePost,
	getAllPosts,
	getPost,
};
