const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipesRouter = require('./routes/recipes');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();  // Ensure this line is present

const app = express();

const PORT = process.env.PORT || 3001;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas', err);
});

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(cors({
  origin: true, // Allow all origins
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/recipes', recipesRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
