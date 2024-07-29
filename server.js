if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const recipesRouter = require('./routes/recipes');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('Error connecting to MongoDB Atlas', err);
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
