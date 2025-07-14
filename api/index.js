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
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import { sendPasswordResetEmail } from './utils/emailService.js';



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

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.send({status: "User not existed"});
    }
    
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, 
      {expiresIn: '1d'});

    // Send password reset email using the email service (only if configured)
    try {
      if (process.env.GMAIL_REFRESH_TOKEN) {
        await sendPasswordResetEmail(email, user._id, token);
        return res.send({Status: "Success"});
      } else {
        console.log('Email service not configured - cannot send password reset email');
        return res.send({status: "Error", message: "Email service not configured"});
      }
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.send({status: "Error", message: "Failed to send email"});
    }
    
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    return res.send({status: "Error", message: error.message});
  }
});

app.post('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.id !== id) {
      return res.send({Status: "Invalid token"});
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return res.send({Status: "Success"});
    
  } catch (error) {
    console.error('Error in reset-password route:', error);
    return res.send({Status: "Error", message: error.message});
  }
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
