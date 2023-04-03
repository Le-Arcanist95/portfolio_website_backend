// Import requires (dotenv, express, mongoose, cors, expressjwt, morgan, PORT, URI)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { expressjwt } = require('express-jwt');
const morgan = require('morgan');
const PORT = process.env.PORT || 4000;
const URI = process.env.MONGODB_URI;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
const app = express();

// Setup middleware (morgan, express.json, cors)
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: corsOrigin, credentials: true}));

// Connect to Database
mongoose.set('strictQuery', true);
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});

// Connect routes and setup protected routes with expressjwt
app.use('/auth', require('./routes/authRouter.js'));
app.use('/api', expressjwt({secret: process.env.SECRET, algorithms: ['HS256']}));
app.use('/api/projects', require('./routes/projectRouter.js'));
app.use('/api/profile', require('./routes/profileRouter.js'));
app.use('/api/experience', require('./routes/experienceRouter.js'));

// Custom Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    if (err.name === 'UnauthorizedError') {
        res.status(err.status);
    }
    return res.send({errMsg: err.message});
});

// Connect to server and database and listen for requests on PORT
const dbConnection = mongoose.connection;
dbConnection.on('error', (err) => console.log(`Connection Error: ${err}`));
dbConnection.on('disconnected', () => console.log('Mongoose is disconnected'));
dbConnection.once('open', () => {
    console.log('Mongoose is connected');
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});