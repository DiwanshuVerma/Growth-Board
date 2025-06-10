import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Twitter login success -> set cookie or token
    res.redirect('/dashboard'); // or send token if SPA
  });

export default router;
