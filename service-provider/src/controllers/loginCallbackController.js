// src/controllers/loginCallbackController.js
const { KeycloakOAuth2Client } = require('../clients/keycloak-oauth2-client');

const LoginCallbackController = {
  handle: async (req, res) => {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        throw new Error('Missing required parameters');
      }

      console.log('Callback received:', { code, state });

      const oAuth2Client = new KeycloakOAuth2Client();
      const tokenResponse = await oAuth2Client.getAccessToken(code, state);

      console.log('Token received successfully');

      res.cookie('accessToken', tokenResponse.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000 // 1 hora
      });

      res.redirect('/');
    } catch (err) {
      console.error('Callback error:', err.message);
      res.redirect('/login');
    }
  }
};

module.exports = LoginCallbackController;