const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();  // إضافة هذه السطر
const { router: authRoutes, authMiddleware } = require('./routes/auth');
const courseRoutes = require('./routes/course'); 

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);


app.use('/api/courses', authMiddleware, courseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
