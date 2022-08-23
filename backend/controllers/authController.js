const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		// Check if user exists
		const user = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: 'User not found' });

		//check password
		const isCorrect = await bcrypt.compare(password, user.password);
		if (isCorrect) {
			const token = generateToken(user);
			res.status(200).json({
				id: user._id,
				token: token,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				profilePicture: user.profilePicture,
			});
		} else return res.status(400).json({ message: 'Incorrect password' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server error' });
	}
};

const register = async (req, res) => {
	const { firstName, lastName, phone, email, password } = req.body;
	try {
		// Check if user exists
		const userExists = await User.findOne({ email });
		if (userExists)
			return res.status(400).json({ message: 'User already exists' });

		//hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const user = new User({
			email,
			password: hashedPassword,
			firstName,
			lastName,
			phone,
		});
		await user.save();
		const token = generateToken(user);
		res.status(200).json({
			id: user._id,
			token: token,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			profilePicture: user.profilePicture,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server error' });
	}
};

generateToken = (user) => {
	return jwt.sign(
		{ id: user._id, email: user.email, profilePicture: user.profilePicture },
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES_IN,
		}
	);
};

module.exports = { login, register };
