class OAuth2Client {
    async getOpenIdConfig() { throw new Error('Not implemented'); }
    async getAccessToken(code) { throw new Error('Not implemented'); }
    async getUserInfo(accessToken) { throw new Error('Not implemented'); }
    async getAuthenticatorUrl() { throw new Error('Not implemented'); }
    async getLogoutUrl(redirectUri) { throw new Error('Not implemented'); }
  }
  
  module.exports = OAuth2Client;