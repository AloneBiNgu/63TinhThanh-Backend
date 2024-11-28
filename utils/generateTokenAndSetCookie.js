const jwt = require('jsonwebtoken');

module.exports = generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '7d',
	});

	res.cookie('token', token, {
		domain: process.env.DOMAIN || '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'none',
		maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
	});

	return token;
};
