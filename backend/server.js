require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todos'));

// Serve static assets in production (if applicable)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
    
    // Send a generic API response if no static file is found
    app.use((req, res) => {
        res.status(200).send("Backend API is running. Please use the frontend app to interact.");
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server started on port ${PORT} (0.0.0.0)`));
