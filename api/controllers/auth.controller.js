import User from '../models/user.model.js';
import OTP from '../models/otp.model.js';
import bcrypt from 'bcryptjs';
import { errorHandler } from '../utils/error.js';    
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail, sendRegistrationOTP, sendPasswordResetOTP } from '../utils/emailService.js';


// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP for registration
export const sendRegistrationOTPController = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "User already exists with this email!"));
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTP for this email and type
        await OTP.deleteMany({ email, type: 'registration' });

        // Save OTP to database
        const newOTP = new OTP({
            email,
            otp,
            type: 'registration'
        });
        await newOTP.save();

        // For development - always show OTP in console and return it
        console.log('🔑 DEVELOPMENT MODE - OTP System');
        console.log(`📧 Registration OTP for ${email}: ${otp}`);
        
        // Try to send email (don't block if it fails)
        try {
            if (process.env.GMAIL_APP_PASSWORD) {
                const emailResult = await sendRegistrationOTP(email, otp);
                if (emailResult.success) {
                    console.log('✅ Registration OTP email sent successfully');
                } else {
                    console.log('❌ Failed to send OTP email:', emailResult.message);
                }
            } else {
                console.log('📧 Email service not configured - OTP shown in console only');
            }
        } catch (emailError) {
            console.error('❌ Error sending OTP email:', emailError.message);
        }
        
        res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            developmentOTP: otp // Always return OTP for development
        });
        
    } catch (error) {
        next(error);
    }
};

// Verify OTP and complete registration
export const verifyRegistrationOTP = async (req, res, next) => {
    const { email, otp, username, password } = req.body;
    
    try {
        // Find valid OTP
        const validOTP = await OTP.findOne({ 
            email, 
            otp, 
            type: 'registration',
            expiresAt: { $gt: new Date() }
        });

        if (!validOTP) {
            return next(errorHandler(400, "Invalid or expired OTP!"));
        }

        // Check if user already exists (double check)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(errorHandler(400, "User already exists with this email!"));
        }

        // Hash password and create user
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({
            username, 
            email, 
            password: hashedPassword
        });
        
        await newUser.save();

        // Mark OTP as verified and delete
        await OTP.deleteMany({ email, type: 'registration' });

        // Send welcome email
        try {
            if (process.env.GMAIL_APP_PASSWORD) {
                await sendWelcomeEmail(email, username);
            } else {
                console.log('Email service not configured - skipping welcome email');
            }
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
        
    } catch (error) {
        next(error);
    }
};

// Send OTP for password reset
export const sendPasswordResetOTPController = async (req, res, next) => {
    const { email } = req.body;
    
    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, "No account found with this email!"));
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTP for this email and type
        await OTP.deleteMany({ email, type: 'password_reset' });

        // Save OTP to database
        const newOTP = new OTP({
            email,
            otp,
            type: 'password_reset'
        });
        await newOTP.save();

        // For development - always show OTP in console and return it
        console.log('🔑 DEVELOPMENT MODE - OTP System');
        console.log(`📧 Password Reset OTP for ${email}: ${otp}`);
        
        // Try to send email (don't block if it fails)
        try {
            if (process.env.GMAIL_APP_PASSWORD) {
                const emailResult = await sendPasswordResetOTP(email, otp);
                if (emailResult.success) {
                    console.log('✅ Password reset OTP email sent successfully');
                } else {
                    console.log('❌ Failed to send password reset OTP email:', emailResult.message);
                }
            } else {
                console.log('📧 Email service not configured - OTP shown in console only');
            }
        } catch (emailError) {
            console.error('❌ Error sending password reset OTP email:', emailError.message);
        }
        
        res.status(200).json({
            success: true,
            message: "OTP generated successfully",
            developmentOTP: otp // Always return OTP for development
        });
        
    } catch (error) {
        next(error);
    }
};

// Verify OTP and reset password
export const verifyPasswordResetOTP = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    
    try {
        // Find valid OTP
        const validOTP = await OTP.findOne({ 
            email, 
            otp, 
            type: 'password_reset',
            expiresAt: { $gt: new Date() }
        });

        if (!validOTP) {
            return next(errorHandler(400, "Invalid or expired OTP!"));
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404, "User not found!"));
        }

        // Hash new password and update
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Delete OTP
        await OTP.deleteMany({ email, type: 'password_reset' });

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
        
    } catch (error) {
        next(error);
    }
};

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);   
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        
        // Send welcome email (don't block signup if email fails or is not configured)
        try {
            if (process.env.GMAIL_APP_PASSWORD) {
                await sendWelcomeEmail(email, username);
            } else {
                console.log('Email service not configured - skipping welcome email');
            }
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
        }
        
        res.status(201).json({
             message: "User created successfully" });
        
    } catch (error) {
        next(error);
    }               
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try{
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, "User not found!"));

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc;
        
        res
        .cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json({
            success: true,
            ...rest
        });

    }catch(error){
        next(error);
    }
};

export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          ...rest
        });
        
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + 
                               Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      
      const newUser = new User({ 
        username: name ? name.split(" ").join("").toLowerCase() + 
                  Math.random().toString(36).slice(-4) : 
                  'user' + Math.random().toString(36).slice(-8),
        email: email, 
        password: hashedPassword, 
        avatar: photo || ''
      });

      await newUser.save();
      
      // Send welcome email (don't block if it fails or is not configured)
      try {
        if (process.env.GMAIL_APP_PASSWORD) {
          await sendWelcomeEmail(email, newUser.username);
        } else {
          console.log('Email service not configured - skipping welcome email');
        }
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
      
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({
          success: true,
          ...rest
        });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during Google authentication'
    });
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
