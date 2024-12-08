// src/controllers/loginController.js
const { KeycloakOAuth2Client } = require('../clients/keycliak-oauth2-client');
const config = require('../config/environment');

const LoginController = {
  handle: async (req, res) => {
    const oAuth2Client = new KeycloakOAuth2Client({
      baseUrl: config.KEYCLOAK.BASE_URL,
      realm: config.KEYCLOAK.REALM,
      clientId: config.KEYCLOAK.CLIENT_ID,
      clientSecret: config.KEYCLOAK.CLIENT_SECRET,
      redirectUri: config.KEYCLOAK.REDIRECT_URI
    });

    try {
      const authUrl = await oAuth2Client.getAuthenticatorUrl();
      res.redirect(authUrl);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        status: 500,
        message: 'An unexpected error occurred'
      });
    }
  }
};

module.exports = LoginController;