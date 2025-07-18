import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Google Strategy (if environment variables are set)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with Google ID
      if (storage.getUserByGoogleId) {
        const existingUser = await storage.getUserByGoogleId(profile.id);
        if (existingUser) {
          return done(null, existingUser);
        }
      }

      // Check if user exists with email
      const email = profile.emails?.[0]?.value;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          // Link Google account to existing user
          await storage.updateUser(existingUser.id, { googleId: profile.id });
          return done(null, existingUser);
        }
      }

      // Create new user
      const newUser = await storage.createUser({
        email: email || `${profile.id}@gmail.com`,
        firstName: profile.name?.givenName || profile.displayName || "User",
        lastName: profile.name?.familyName || "",
        googleId: profile.id,
        profileImage: profile.photos?.[0]?.value,
        isChef: false
      });

      return done(null, newUser);
    } catch (error) {
      return done(error);
    }
  }));
}

export default passport;
