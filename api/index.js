import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';   
import authRouter from './routes/auth.route.js';
import uploadRoute from './routes/upload.route.js'; 
import listingRouter from './routes/listing.route.js';
import cors from 'cors';    
import cookieParser from 'cookie-parser';
import path from 'path';



dotenv.config();

const app = express();
const __dirname = path.resolve();


app.use(express.json());

app.use(cookieParser());



const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));


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
app.use("/api/upload", uploadRoute); 
app.use('/api/listing', listingRouter);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Serve React app for all non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


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
