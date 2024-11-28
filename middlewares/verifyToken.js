const jwt = require('jsonwebtoken');

export const verifyToken = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
		if (Math.floor(Date.now() / 1000) >= decoded?.exp) {
			return res.status(401).json({ success: false, message: 'Unauthorized - Token is expired' });
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Server Error',
		});
	}
};
