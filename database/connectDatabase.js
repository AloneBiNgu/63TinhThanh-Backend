import mongoose from 'mongoose';

let isConnected = false;

export const connectDatabase = async () => {
	if (isConnected) {
		console.log('Using existing database connection');
		return;
	}

	try {
		const dbUri = process.env.MONGODB_URI;
		if (!dbUri) {
			throw new Error('MONGODB_URI is not defined in environment variables');
		}

		const db = await mongoose.connect(dbUri);
		isConnected = db.connections[0].readyState === 1;
		console.log('Connected to MongoDB successfully');
	} catch (error) {
		console.error('Error connecting to MongoDB:', error.message);
		process.exit(1);
	}
};
