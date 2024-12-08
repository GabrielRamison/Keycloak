const crypto = require('crypto');
const config = require('../config/environment');
const passport = require('passport');
const { generatePKCE, storePKCE, getPKCE, clearPKCE } = require('../utils/pkce');

class AuthController {
  static home(req, res) {
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
  }

  static register(req, res) {
    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');
    storePKCE(state, { verifier, challenge });

    const registrationUrl = new URL(`${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/registrations`);
    registrationUrl.searchParams.set('client_id', config.KEYCLOAK.CLIENT_ID);
    registrationUrl.searchParams.set('response_type', 'code');
    registrationUrl.searchParams.set('scope', 'openid email profile');
    registrationUrl.searchParams.set('redirect_uri', `${config.APP_URL}/callback`);
    registrationUrl.searchParams.set('state', state);
    registrationUrl.searchParams.set('code_challenge', challenge);
    registrationUrl.searchParams.set('code_challenge_method', 'S256');
    
    res.redirect(registrationUrl.toString());
  }

  static login(req, res, next) {
    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');
    storePKCE(state, { verifier, challenge });

    const authenticateConfig = {
      state,
      pkce: true,
      usePKCE: true,
      params: {
        code_challenge: challenge,
        code_challenge_method: 'S256'
      }
    };

    passport.authenticate('oidc', authenticateConfig)(req, res, next);
  }

  static callback(req, res, next) {
    console.log('Callback received:', req.query);

    if (req.query.error) {
      console.error('Auth error:', req.query.error, req.query.error_description);
      return res.redirect('/login');
    }

    const state = req.query.state;
    const pkceData = getPKCE(state);

    if (!pkceData) {
      return res.status(400).send('Invalid state parameter');
    }

    passport.authenticate('oidc', {
      code_verifier: pkceData.verifier,
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);

    clearPKCE(state);
  }

  static logout(req, res) {
    const logoutUrl = new URL(`${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.set('redirect_uri', config.APP_URL);

    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.redirect('/');
      }
      res.redirect(logoutUrl.toString());
    });
  }
}

module.exports = AuthController;