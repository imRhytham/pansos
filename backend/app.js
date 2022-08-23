//import modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8080;
const connectDB = require('./config/connectDB');
const authRoutes = require('./routes/authRoutes');

//app config
const app = express();
const server = require('http').Server(app);
app.use(cors());

//middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//import routes
app.use('/api', authRoutes); //authentication

//start server
const start = async () => {
	try {
		await connectDB();
		server.listen(port, () => console.log(`Server started on port ${port}`));
	} catch (error) {
		console.log(error);
	}
};

start();
