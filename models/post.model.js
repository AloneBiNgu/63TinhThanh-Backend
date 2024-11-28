import mongoose, { mongo } from 'mongoose';

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		description: {
			type: String,
			required: true,
		},

		content: {
			type: String,
			required: true,
		},

		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const Post = mongoose.model('Post', postSchema);
