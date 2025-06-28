import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET!
const MONGO_ATLAS_URI = process.env.MONGO_ATLAS_URI!
const EMAIL_USER = process.env.EMAIL_USER!
const EMAIL_PASS = process.env.EMAIL_PASS!

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY!
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET!

const FRONTEND_URI = process.env.FRONTEND_URI!

if (!JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
if (!MONGO_ATLAS_URI) throw new Error("MONGO_ATLAS_URI is missing in .env");

if (!EMAIL_USER) throw new Error("EMAIL_USER is missing in .env");
if (!EMAIL_PASS) throw new Error("EMAIL_PASS is missing in .env");

if (!TWITTER_CONSUMER_KEY) throw new Error("TWITTER_CONSUMER_KEY is missing in .env");
if (!TWITTER_CONSUMER_SECRET) throw new Error("TWITTER_CONSUMER_SECRET is missing in .env");

if (!FRONTEND_URI) throw new Error("FRONTEND_URI is missing in .env");


export { JWT_SECRET, MONGO_ATLAS_URI, EMAIL_USER, EMAIL_PASS, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, FRONTEND_URI };
