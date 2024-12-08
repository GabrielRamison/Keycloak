const axios = require('axios');
const OAuth2Client = require('../clients/ouath2-client');

class KeycloakOAuth2Client extends OAuth2Client {
  constructor(config) {
    super();
    this.config = config;
  }

  async getOpenIdConfig() {
    const response = await axios.get(
      `${this.config.baseUrl}/realms/${this.config.realm}/.well-known/openid-configuration`
    );
    return {
      authorization_endpoint: response.data.authorization_endpoint,
      end_session_endpoint: response.data.end_session_endpoint,
      token_endpoint: response.data.token_endpoint,
    };
  }

  async getAccessToken(code) {
    const response = await axios.post(
      `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    if (response.data && response.data.access_token) {
      return response.data.access_token;
    }
    throw new Error('Failed to obtain access token');
  }

  async getUserInfo(accessToken) {
    const response = await axios.get(
      `${this.config.baseUrl}/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to obtain user info');
  }

  async getAuthenticatorUrl() {
    const authUrl = await this.getOpenIdConfig()
      .then(config => config.authorization_endpoint);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'openid email profile'
    });

    return `${authUrl}?${params.toString()}`;
  }

  async getLogoutUrl(redirectUri) {
    const endSessionUrl = await this.getOpenIdConfig()
      .then(config => config.end_session_endpoint);
    return `${endSessionUrl}?redirect_uri=${redirectUri}`;
  }
}

module.exports = { KeycloakOAuth2Client };