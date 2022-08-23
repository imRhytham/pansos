const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		phone: {
			type: Number,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		followers: [],
		following: [],
		posts: [],
		profilePicture: {
			type: String,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model('User', UserSchema);

UserSchema.pre('save', async function () {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (password) {
	const isCorrect = await bcrypt.compare(password, this.password);
	return isCorrect;
};

UserSchema.methods.createJWT = function () {
	return jwt.sign(
		{ id: this._id, email: this.email, profilePicture: this.profilePicture },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
};

module.exports = User;
