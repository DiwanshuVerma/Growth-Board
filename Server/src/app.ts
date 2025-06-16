import express from 'express';
import passport from 'passport';
import session from 'express-session';
import './auth/passport';
import cors from 'cors'

const app = express();
app.use(cors())

app.use(express.json());
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route'
import habitRoutes from './routes/habit.route'

app.use('/users', userRoutes)
app.use('/auth', authRoutes)
app.use('/habits', habitRoutes)

export const createApp = () => app
