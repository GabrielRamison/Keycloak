// service-provider/app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
const crypto = require('crypto');

const app = express();

// Base URLs
const EXTERNAL_KEYCLOAK_URL = 'http://localhost:8080';
const INTERNAL_KEYCLOAK_URL = 'http://keycloak:8080';
const APP_URL = 'http://localhost:3001';

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Gerar code verifier e challenge para PKCE
function generatePKCE() {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
}

const { verifier, challenge } = generatePKCE();

const strategyConfig = {
  issuer: `${INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
  authorizationURL: `${EXTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
  tokenURL: `${INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
  userInfoURL: `${INTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
  clientID: process.env.KEYCLOAK_CLIENT_ID,
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
  callbackURL: `${APP_URL}/callback`,
  scope: ['openid', 'profile', 'email'],
  responseType: 'code',
  // Configuração PKCE
  pkce: true,
  codeChallengeMethod: 'S256',
  codeVerifier: verifier,
  codeChallenge: challenge,
  state: true,
  passReqToCallback: true
};

passport.use('oidc', new Strategy(strategyConfig, (req, issuer, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`
      <h1>Welcome ${req.user.displayName || 'User'}</h1>
      <div>
        <h2>User Profile</h2>
        <p>Email: ${req.user.emails ? req.user.emails[0].value : 'Not available'}</p>
        <p>ID: ${req.user.id}</p>
        <hr/>
        <a href="/logout">Logout</a>
      </div>
    `);
  } else {
    res.send(`
      <h1>Welcome to Service Provider</h1>
      <div>
        <a href="/login">Login</a>
        <span> | </span>
        <a href="/register">Register</a>
      </div>
    `);
  }
});

app.get('/register', (req, res) => {
  const registrationUrl = new URL(`${EXTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/registrations`);
  registrationUrl.searchParams.set('client_id', process.env.KEYCLOAK_CLIENT_ID);
  registrationUrl.searchParams.set('response_type', 'code');
  registrationUrl.searchParams.set('scope', 'openid email profile');
  registrationUrl.searchParams.set('redirect_uri', `${APP_URL}/callback`);
  registrationUrl.searchParams.set('code_challenge', challenge);
  registrationUrl.searchParams.set('code_challenge_method', 'S256');
  
  res.redirect(registrationUrl.toString());
});

app.get('/login', (req, res, next) => {
  const pkceParams = {
    code_challenge: challenge,
    code_challenge_method: 'S256'
  };
  passport.authenticate('oidc', { ...pkceParams })(req, res, next);
});

app.get('/callback',
  passport.authenticate('oidc', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.get('/logout', (req, res) => {
  const logoutUrl = new URL(`${EXTERNAL_KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set('redirect_uri', APP_URL);

  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect(logoutUrl.toString());
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service Provider running on port ${PORT}`);
  console.log(`App URL: ${APP_URL}`);
  console.log(`External Keycloak URL: ${EXTERNAL_KEYCLOAK_URL}`);
});