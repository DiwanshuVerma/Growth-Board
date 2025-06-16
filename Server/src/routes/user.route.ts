import express, { RequestHandler } from 'express';
import {
  sendOtp,
  verifyOtpAndCreateUser,
  loginWithEmail,
  Allusers,
  getCurrentUser,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.get('/me', verifyToken, getCurrentUser as RequestHandler);
router.post('/verify-otp', verifyOtpAndCreateUser);
router.post('/login', loginWithEmail);
router.get('/bulk', Allusers)

export default router;
