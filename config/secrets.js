/**
 * secrets
 */
module.exports = {
  sessionSecret: process.env.SESSION_SECRET || "12345",
  google: {
    clientID: process.env.GOOGLE_CLIENTID || "62351010161-eqcnoa340ki5ekb9gvids4ksgqt9hf48.apps.googleusercontent.com",
    clientSecret: process.env.GOOGLE_SECRET || "6cKCWD75gHgzCvM4VQyR5_TU",
    callbackURL: process.env.GOOGLE_CALLBACK || "/auth/google/callback"
  }
};
