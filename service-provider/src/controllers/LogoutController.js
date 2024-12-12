// src/controllers/logoutController.js
const { KeycloakOAuth2Client } = require('../clients/keycloak-oauth2-client');

const LogoutController = {
  handle: async (req, res) => {
    try {
      const oAuth2Client = new KeycloakOAuth2Client();
      const logoutUrl = await oAuth2Client.getLogoutUrl();

      // Limpar o cookie de acesso
      res.clearCookie('accessToken');
      
      // Redirecionar para a URL de logout do Keycloak
      res.redirect(logoutUrl);
    } catch (err) {
      console.error('Logout error:', err);
      // Em caso de erro, pelo menos limpar o cookie e redirecionar para home
      res.clearCookie('accessToken');
      res.redirect('/');
    }
  }
};

module.exports = LogoutController;