import express from 'express';
import passport from 'passport';
import { FRONTEND_URI } from '../config/env';

const router = express.Router();

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: `${FRONTEND_URI}/habits`,
    failureRedirect: FRONTEND_URI,
  })
);

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

export default router;

