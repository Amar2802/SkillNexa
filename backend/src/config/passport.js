import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        passReqToCallback: true
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const requestedField = normalizeTargetField(req.query.state);
          let user = await User.findOne({ $or: [{ email }, { googleId: profile.id }] });

          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value,
              targetField: requestedField,
              progress: {
                testsTaken: 0,
                accuracy: 0,
                weakTopics: [],
                recommendedTopics: FIELD_DEFAULT_TOPICS[requestedField] || FIELD_DEFAULT_TOPICS.Software
              }
            });
          } else if (!user.targetField) {
            user.targetField = requestedField;
            user.progress = {
              ...(user.progress || {}),
              recommendedTopics: FIELD_DEFAULT_TOPICS[requestedField] || FIELD_DEFAULT_TOPICS.Software
            };
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

export default passport;
