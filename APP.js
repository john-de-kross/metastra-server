const express = require('express');
const userRoutes = require('./ROUTES/userRoutes');
const cors = require('cors');
const AppError = require('./CONTROLLERS/ERROR/appError');
const globalErrorHandler = require('./CONTROLLERS/ERROR/globalErrorHandler')
const app = express();

app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'https://metastra.vercel.app']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
        
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200 
})); 





app.use('/api/v1/users', userRoutes); 

app.use(globalErrorHandler);


module.exports = app;  
