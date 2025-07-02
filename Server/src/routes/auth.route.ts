import express from 'express';
import passport from 'passport';
import { FRONTEND_URI, JWT_SECRET } from '../config/env';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', (req, res, next) => {
  passport.authenticate('twitter', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.redirect(`${FRONTEND_URI}?error=twitter_auth_failed`);
    }
    // Generate JWT
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    // Redirect to frontend with token and user info
    const userInfo = encodeURIComponent(JSON.stringify({
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      email: user.email,
      twitterId: user.twitterId,
      points: user.points
    }))
    return res.redirect(`${FRONTEND_URI}/twitter-success?token=${token}&user=${userInfo}`)
  })(req, res, next)
})

export default router;

