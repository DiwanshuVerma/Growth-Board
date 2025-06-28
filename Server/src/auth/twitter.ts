import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../config/env';
import UserModel from '../models/User.model';

passport.use(new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY!,
    consumerSecret: TWITTER_CONSUMER_SECRET!,
    callbackURL: 'http://localhost:5000/auth/twitter/callback',
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ twitterId: profile.id })
      if (existingUser) {
        return done(null, existingUser)
      }

      const newUser = new UserModel({
        username: profile.username || profile.displayName,
        avatar: profile.photos?.[0]?.value || '',
        twitterId: profile.id,
        email: profile.emails?.[0]?.value || undefined,
        password: undefined
      })

      await newUser.save()
      return done(null, newUser)
    } catch (err) {
      return done(err, null)
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})