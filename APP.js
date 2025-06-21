const express = require('express');
const userRoutes = require('./ROUTES/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./CONTROLLERS/ERROR/appError');
const globalErrorHandler = require('./CONTROLLERS/ERROR/globalErrorHandler')
const app = express();
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const allowedOrigins = [
  'http://localhost:5173',            // for local dev
  'https://metastra.vercel.app'      // for production
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use(cookieParser());

app.use('/api/v1/users', userRoutes); 

app.use(globalErrorHandler);

module.exports = app;  
