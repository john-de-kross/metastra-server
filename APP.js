const express = require('express');
const userRoutes = require('./ROUTES/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./CONTROLLERS/ERROR/appError');
const globalErrorHandler = require('./CONTROLLERS/ERROR/globalErrorHandler')
const app = express();
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ?
        'https://metastra.vercel.app'
        :
        'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(cookieParser());

app.use('/api/v1/users', userRoutes); 

app.use(globalErrorHandler);

module.exports = app;  
