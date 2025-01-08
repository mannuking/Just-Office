require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000' // Allow requests from frontend running on port 3000
}));

// Use middleware
app.use(express.json());

// Define routes for listings
app.use('/api/listings', require('./routes/listings'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start the server after connecting to the database
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
};

startServer();
