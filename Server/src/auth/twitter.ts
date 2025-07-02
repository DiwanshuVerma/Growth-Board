import passport from 'passport';
import { Profile, Strategy as TwitterStrategy } from 'passport-twitter';
import { BACKEND_URI, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../config/env';
import UserModel from '../models/User.model';
import oauth from 'oauth'

passport.use(new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY!,
    consumerSecret: TWITTER_CONSUMER_SECRET!,
    callbackURL: `${BACKEND_URI}/auth/twitter/callback`,
    includeEmail: true,
  },
  async (token, tokenSecret, profile, done) => {
    try {
      const existingUser = await UserModel.findOne({ twitterId: profile.id })
      if (existingUser) {
        return done(null, existingUser)
      }

      const newUser = new UserModel({
        username: profile.username,
        displayName: profile.displayName,
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

// const TwitterStrategyPrototype = (TwitterStrategy as any).prototype;

// TwitterStrategyPrototype.userProfile = function (
//   token: string,
//   tokenSecret: string,
//   params: any,
//   done: (err: Error | null, profile?: Profile) => void
// ) {
//   const oauthClient = new oauth.OAuth(
//     'https://api.twitter.com/oauth/request_token',
//     'https://api.twitter.com/oauth/access_token',
//     TWITTER_CONSUMER_KEY,
//     TWITTER_CONSUMER_SECRET,
//     '1.0A',
//     null,
//     'HMAC-SHA1'
//   );

//   oauthClient.get(
//     'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
//     token,
//     tokenSecret,
//     (err: any, body: any) => {
//       if (err) return done(new Error('Failed to fetch user profile from Twitter.'));
//       try {
//         const json = JSON.parse(body);
//         const profile: Profile = {
//           provider: 'twitter',
//           id: json.id_str,
//           displayName: json.name,
//           username: json.screen_name,
//           photos: [{ value: json.profile_image_url_https }],
//           emails: json.email ? [{ value: json.email }] : [],
//           _raw: body,
//           _json: json
//         } as Profile;
//         return done(null, profile);
//       } catch (parseError) {
//         return done(parseError as Error);
//       }
//     }
//   );
// };