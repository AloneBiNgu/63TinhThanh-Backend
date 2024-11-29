const User = require('../models/user.model');
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
	const { email, password, username } = req.body;

	try {
		if (!email || !password || !username) {
			return res.status(200).json({ success: false, message: 'All fields are required' });
		}

		const userAlreadyExists = await User.find({ email }).lean().exec();
		if (userAlreadyExists.length > 0) {
			return res.status(200).json({ success: false, message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ email, password: hashedPassword, name: username });
		await newUser.save();

		generateTokenAndSetCookie(res, newUser._id);

		res.status(201).json({
			success: true,
			message: 'User created successfully',
			user: { ...newUser._doc, password: undefined },
		});
	} catch (error) {
		console.error('Signup error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const signIn = async (req, res) => {
	const { username, password } = req.body;
	console.log(username, password);
	try {
		if (!username || !password) {
			return res.status(200).json({ success: false, message: 'All fields are required' });
		}

		const user = await User.findOne({ name: username }).lean().exec();
		if (!user) {
			return res.status(200).json({ success: false, message: 'Invalid cridentails' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(200).json({ success: false, message: 'Invalid cridentails' });
		}

		res.status(200).json({
			success: true,
			message: 'User logged in successfully',
			user: { ...user, password: undefined },
			cookie: generateTokenAndSetCookie(res, user._id),
		});
	} catch (error) {
		console.error('SignIn error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const logout = async (req, res) => {
	res.cookie('token', '', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'None',
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});
	res.json({ success: true, message: 'User logged out successfully' });
};

const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password -_id -__v').lean().exec();
		if (!user) {
			return res.status(200).json({ success: false, message: 'User not found' });
		}

		res.status(200).json({
			success: true,
			user,
		});
	} catch (error) {
		console.error('CheckAuth error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = { signUp, signIn, logout, checkAuth };
