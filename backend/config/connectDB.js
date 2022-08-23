const mongoose = require('mongoose');

const connectDB = async () => {
	await mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log('Database Connected');
};

module.exports = connectDB;
