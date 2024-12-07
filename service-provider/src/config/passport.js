// config/passport.js
const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
const config = require('./enviroment');

const strategyConfig = {
  issuer: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}`,
  authorizationURL: `${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/auth`,
  tokenURL: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/token`,
  userInfoURL: `${config.INTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/userinfo`,
  clientID: config.KEYCLOAK.CLIENT_ID,
  clientSecret: config.KEYCLOAK.CLIENT_SECRET,
  callbackURL: `${config.APP_URL}/callback`,
  scope: ['openid', 'profile', 'email'],
  passReqToCallback: true
};

passport.use('oidc', new Strategy(strategyConfig, 
  (req, issuer, profile, context, idToken, accessToken, refreshToken, params, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;