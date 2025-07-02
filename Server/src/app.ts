import express from 'express';
import passport from 'passport';
import session from 'express-session';
import './auth/twitter';
import cors from 'cors'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());
app.use(passport.initialize());

app.use('/auth/twitter', session({
  secret: 'twitter_oauth_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set true if using HTTPS
}));

import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import habitRoutes from './routes/habit.route'
import leaderboardRoutes from './routes/leaderboard.route'

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/habits', habitRoutes)
app.use('/leaderboard', leaderboardRoutes)

export const createApp = () => app
