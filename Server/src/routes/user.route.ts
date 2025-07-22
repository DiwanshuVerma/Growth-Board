import express, { RequestHandler } from 'express';
import {
  sendOtp,
  verifyOtpAndCreateUser,
  loginWithEmail,
  Allusers,
  getCurrentUser,
  updateUser,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/authMiddleware';
import { upload } from '../middleware/multerConfig';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.put('/update', verifyToken, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateUser as RequestHandler);

router.get('/me', verifyToken, getCurrentUser as RequestHandler);
router.post('/verify-otp', verifyOtpAndCreateUser);
router.post('/login', loginWithEmail);
router.get('/bulk', Allusers)

export default router;
