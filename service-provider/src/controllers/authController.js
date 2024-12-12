const crypto = require('crypto');
const config = require('../config/environment');
const { generatePKCE, storePKCE, getPKCE, clearPKCE } = require('../utils/pkce');
const axios = require('axios');

class AuthController {
  static async home(req, res) {
    const accessToken = req.cookies.accessToken;
    
    if (accessToken) {
      try {
        const userInfo = await AuthController.getUserInfo(accessToken);
        res.send(`
          <h1>Welcome ${userInfo.name || 'User'}</h1>
          <div>
            <h2>User Profile</h2>
            <p>Email: ${userInfo.email || 'Not available'}</p>
            <p>ID: ${userInfo.sub}</p>
            <hr/>
            <a href="/logout">Logout</a>
          </div>
        `);
      } catch (error) {
        res.clearCookie('accessToken');
        res.redirect('/login');
      }
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

  static login(req, res) {
    const { verifier, challenge } = generatePKCE();
    const state = crypto.randomBytes(16).toString('hex');
    storePKCE(state, { verifier, challenge });

    const loginUrl = new URL(`${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/auth`);
    loginUrl.searchParams.set('client_id', config.KEYCLOAK.CLIENT_ID);
    loginUrl.searchParams.set('response_type', 'code');
    loginUrl.searchParams.set('scope', 'openid email profile');
    loginUrl.searchParams.set('redirect_uri', `${config.APP_URL}/callback`);
    loginUrl.searchParams.set('state', state);
    loginUrl.searchParams.set('code_challenge', challenge);
    loginUrl.searchParams.set('code_challenge_method', 'S256');

    res.redirect(loginUrl.toString());
  }

  static async callback(req, res) {
    const { code, state } = req.query;

    if (req.query.error) {
      console.error('Auth error:', req.query.error, req.query.error_description);
      return res.redirect('/login');
    }

    const pkceData = getPKCE(state);
    if (!pkceData) {
      return res.status(400).send('Invalid state parameter');
    }

    try {
      const tokenResponse = await AuthController.getTokens(code, pkceData.verifier);
      
      res.cookie('accessToken', tokenResponse.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
      });

      clearPKCE(state);
      res.redirect('/');
    } catch (error) {
      console.error('Token exchange error:', error);
      res.redirect('/login');
    }
  }

  static async logout(req, res) {
    const accessToken = req.cookies.accessToken;
    const logoutUrl = new URL(`${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/logout`);
    logoutUrl.searchParams.set('redirect_uri', config.APP_URL);
    
    if (accessToken) {
      logoutUrl.searchParams.set('id_token_hint', accessToken);
    }

    res.clearCookie('accessToken');
    res.redirect(logoutUrl.toString());
  }

  // Utility methods
  static async getTokens(code, codeVerifier) {
    const tokenUrl = `${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', config.KEYCLOAK.CLIENT_ID);
    params.append('code', code);
    params.append('redirect_uri', `${config.APP_URL}/callback`);
    params.append('code_verifier', codeVerifier);

    const response = await axios.post(tokenUrl, params);
    return response.data;
  }

  static async getUserInfo(accessToken) {
    const userInfoUrl = `${config.EXTERNAL_KEYCLOAK_URL}/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/userinfo`;
    const response = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  }
}

module.exports = AuthController;