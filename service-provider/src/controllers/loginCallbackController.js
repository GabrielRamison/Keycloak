// src/controllers/loginCallbackController.js
const { KeycloakOAuth2Client } = require('../clients/keycliak-oauth2-client');
const config = require('../config/environment');

const LoginCallbackController = {
  handle: async (req, res) => {
    const oAuth2Client = new KeycloakOAuth2Client({
      baseUrl: config.KEYCLOAK.BASE_URL,
      realm: config.KEYCLOAK.REALM,
      clientId: config.KEYCLOAK.CLIENT_ID,
      clientSecret: config.KEYCLOAK.CLIENT_SECRET,
      redirectUri: config.KEYCLOAK.REDIRECT_URI
    });

    try {
      const code = req.query.code;
      if (!code) {
        return res.status(400).json({
          status: 400,
          message: 'Authorization code not provided'
        });
      }
      
      const accessToken = await oAuth2Client.getAccessToken(code);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false
      });
      
      res.redirect('/user');
    } catch (err) {
      console.error('Callback error:', err);
      res.status(500).json({
        status: 500,
        message: 'An unexpected error occurred'
      });
    }
  }
};

module.exports = LoginCallbackController;