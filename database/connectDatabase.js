import mongoose from 'mongoose';

export const connectDatabase = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB connected:`, conn.connection.host);
	} catch (error) {
		console.error(`Failed to connect to the database. Error: ${error.message}`);
		process.exit(1); // 1 = error, 0 = success
	}
};
