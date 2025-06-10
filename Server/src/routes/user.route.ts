import express from 'express';
import {
  sendOtp,
  verifyOtpAndCreateUser,
  loginWithEmail,
  Allusers,
} from '../controllers/user.controller';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpAndCreateUser);
router.post('/login', loginWithEmail);
router.get('/bulk', Allusers)

export default router;
