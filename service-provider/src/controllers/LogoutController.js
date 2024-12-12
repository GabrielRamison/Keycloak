// src/controllers/logoutController.js
const { KeycloakOAuth2Client } = require('../clients/keycloak-oauth2-client');
const config = require('../config/environment');

const LogoutController = {
  handle: async (req, res) => {
    const oAuth2Client = new KeycloakOAuth2Client({
      baseUrl: config.KEYCLOAK.BASE_URL,
      realm: config.KEYCLOAK.REALM,
      clientId: config.KEYCLOAK.CLIENT_ID,
      clientSecret: config.KEYCLOAK.CLIENT_SECRET,
      redirectUri: config.KEYCLOAK.REDIRECT_URI
    });

    try {
      const logoutUrl = await oAuth2Client.getLogoutUrl(config.APP_URL);
      res.clearCookie('accessToken');
      res.redirect(logoutUrl);
    } catch (err) {
      console.error('Logout error:', err);
      res.status(500).json({
        status: 500,
        message: 'An unexpected error occurred'
      });
    }
  }
};

module.exports = LogoutController;