import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';   
import authRouter from './routes/auth.route.js';     

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
    app.listen(3000, () => {
      console.log('Server is running on port 3000!');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Error middleware
app.use((err, req, res, next) => { 
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
