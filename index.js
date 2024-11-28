import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDatabase } from './database/connectDatabase.js';

import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;

const whitelist = ['http://localhost:5173', 'https://63-tinh-thanh.vercel.app'];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
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

app.listen(PORT, () => {
	connectDatabase();
	console.log('Server listening on port 3000');
});
