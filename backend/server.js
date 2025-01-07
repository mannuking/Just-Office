require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from the frontend
}));

// Connect to database
connectDB();

// Use middleware
app.use(express.json());

// Define routes for listings
app.use('/api/listings', require('./routes/listings'));

// Define routes
// app.use('/api/listings', require('./routes/listings'));

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
