const express = require('express');
const userRoutes = require('./ROUTES/userRoutes');
const cors = require('cors');
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

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next()
})

app.use('/api/v1/users', userRoutes);


module.exports = app;  
