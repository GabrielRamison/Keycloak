// src/controllers/LoginController.js
const { KeycloakOAuth2Client } = require('../clients/keycloak-oauth2-client');

const LoginController = {
  handle: async (req, res) => {
    try {
      console.log('Initializing OAuth2 Client');
      const oAuth2Client = new KeycloakOAuth2Client();
      
      console.log('Getting authenticator URL');
      const authUrl = await oAuth2Client.getAuthenticatorUrl();
      console.log('Auth URL:', authUrl);
      
      res.redirect(authUrl);
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({
        status: 500,
        message: err.message || 'An unexpected error occurred'
      });
    }
  }
};

module.exports = LoginController;