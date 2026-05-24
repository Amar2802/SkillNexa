import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { signAccessToken } from "../utils/generateToken.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");
const sanitizeEnvValue = (value) => String(value || "").trim().replace(/^['"]|['"]$/g, "");
const isPlaceholderCredential = (value) => !value || /^your_google_client_(id|secret)$/i.test(value);
const googleClientId = sanitizeEnvValue(process.env.GOOGLE_CLIENT_ID);
const googleClientSecret = sanitizeEnvValue(process.env.GOOGLE_CLIENT_SECRET);

const resolveGoogleCallbackUrl = () => {
  const explicitCallback = sanitizeEnvValue(process.env.GOOGLE_CALLBACK_URL);
  if (explicitCallback) {
    return explicitCallback;
  }

  const publicServerUrl = sanitizeEnvValue(process.env.SERVER_URL || process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL);
  if (publicServerUrl) {
    return `${publicServerUrl.replace(/\/+$/, "")}/api/auth/google/callback`;
  }

  return "/api/auth/google/callback";
};

export const isGoogleOAuthConfigured = !isPlaceholderCredential(googleClientId) && !isPlaceholderCredential(googleClientSecret);

if (isGoogleOAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: resolveGoogleCallbackUrl(),
        passReqToCallback: true
      },
      async (req, _accessToken, _refreshToken, profile, done) => {
        try {
          const email = String(profile.emails?.[0]?.value || "").trim().toLowerCase();
          if (!email) {
            return done(new Error("Google account email is unavailable"), null);
          }
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

          user.oauthAccessToken = signAccessToken(user);
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn("[Auth] Google OAuth is disabled because the client ID/secret are missing or still placeholders.");
}

export default passport;
