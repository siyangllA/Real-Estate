import express from 'express';
import { 
    google, 
    signOut, 
    signin, 
    signup,
    sendRegistrationOTPController,
    verifyRegistrationOTP,
    sendPasswordResetOTPController,
    verifyPasswordResetOTP
} from '../controllers/auth.controller.js';

const router = express.Router();

// Original routes
router.post("/signup", signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut);

// New OTP-based routes
router.post("/send-registration-otp", sendRegistrationOTPController);
router.post("/verify-registration-otp", verifyRegistrationOTP);
router.post("/send-password-reset-otp", sendPasswordResetOTPController);
router.post("/verify-password-reset-otp", verifyPasswordResetOTP);

export default router;







