const { User } = require('../models/user.model.js');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie.js');
const bcrypt = require('bcrypt');

export const signUp = async (req, res) => {
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

export const signIn = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(200).json({ success: false, message: 'All fields are required' });
		}

		const user = await User.findOne({ email }).lean().exec();
		if (!user) {
			return res.status(200).json({ success: false, message: 'Invalid cridentails' });
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(200).json({ success: false, message: 'Invalid cridentails' });
		}

		generateTokenAndSetCookie(res, user._id);

		res.status(200).json({
			success: true,
			message: 'User logged in successfully',
			user: { ...user, password: undefined },
		});
	} catch (error) {
		console.error('SignIn error: ' + error.message);
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const logout = async (req, res) => {
	res.clearCookie('token');
	res.json({ success: true, message: 'User logged out successfully' });
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select('-password').lean().exec();
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
