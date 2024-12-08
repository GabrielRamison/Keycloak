// src/config/passport.js
const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
const config = require('./environment');

const strategyConfig = {
  issuer: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}`,
  authorizationURL: `${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/auth`,
  tokenURL: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/token`,
  userInfoURL: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/userinfo`,
  clientID: config.KEYCLOAK.CLIENT_ID,
  clientSecret: config.KEYCLOAK.CLIENT_SECRET,
  callbackURL: `${config.APP_URL}/callback`,
  scope: ['openid', 'profile', 'email'],
  passReqToCallback: true,
  state: true,                 // Habilita state
  nonce: true,                // Habilita nonce
  pkce: true,                  // Habilita PKCE
  usePKCE: true
};

// Log adicional no callback
passport.use('oidc', new Strategy(strategyConfig, 
  (req, issuer, profile, context, idToken, accessToken, refreshToken, params, done) => {
    console.log('Authentication callback received:', {
      issuer,
      profile: profile || 'No profile',
      context: context || 'No context',
      idToken: idToken || 'No ID token',
      accessToken: accessToken || 'No access token',
      params: params || 'No params'
    });
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('Deserializing user:', user);
  done(null, user);
});

module.exports = passport;