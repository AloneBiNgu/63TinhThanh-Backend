const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDatabase = require('./database/connectDatabase.js');

const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

const whitelist = ['http://localhost:5173', 'https://63-tinh-thanh.vercel.app', 'https://ba-mien-mot-coi.vercel.app'];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},

	credentials: true,
};

app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, '0.0.0.0', () => {
		connectDatabase();
		console.log('Server listening on port 3000');
	});
} else {
	connectDatabase();
	module.exports = app;
}
