// src/clients/keycloak-oauth2-client.js
const axios = require("axios");
const crypto = require('crypto');
const config = require('../config/environment');

class KeycloakOAuth2Client {
  constructor() {
    this.baseUrl = `${config.INTERNAL_KEYCLOAK_URL}/auth`;
    this.realm = config.KEYCLOAK.REALM;
    this.clientId = config.KEYCLOAK.CLIENT_ID;
    this.clientSecret = config.KEYCLOAK.CLIENT_SECRET;
    this.redirectUri = `${config.APP_URL}/callback`;

    // Endpoints
    this.tokenEndpoint = `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/token`;
    this.userInfoEndpoint = `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/userinfo`;

    console.log('KeycloakOAuth2Client initialized with:', {
      baseUrl: this.baseUrl,
      realm: this.realm
    });
  }

  async getOpenIdConfig() {
    try {
      const url = `${this.baseUrl}/realms/${this.realm}/.well-known/openid-configuration`;
      console.log("Requesting OpenID config from:", url);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching OpenID config:", error);
      throw error;
    }
  }

  generatePKCE() {
    const verifier = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto
      .createHash('sha256')
      .update(verifier)
      .digest('base64url');
    return { verifier, challenge };
  }

  async getAccessToken(code, state) {
    try {
      if (!global.pkceStore?.has(state)) {
        throw new Error('Invalid state parameter');
      }

      const verifier = global.pkceStore.get(state);
      global.pkceStore.delete(state);

      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code_verifier: verifier
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Token exchange error:", error.response?.data || error.message);
      throw error;
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(this.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      return response.data;
    } catch (error) {
      console.error("UserInfo error:", error.response?.data || error.message);
      throw error;
    }
  }

  async getAuthenticatorUrl() {
    try {
      const config = await this.getOpenIdConfig();
      const authUrl = config.authorization_endpoint.replace(
        this.baseUrl,
        'http://localhost:8080/auth'
      );

      const { verifier, challenge } = this.generatePKCE();
      const state = crypto.randomBytes(16).toString('hex');
      
      if (global.pkceStore === undefined) {
        global.pkceStore = new Map();
      }
      global.pkceStore.set(state, verifier);

      const params = new URLSearchParams({
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state: state,
        code_challenge: challenge,
        code_challenge_method: 'S256'
      });

      const finalUrl = `${authUrl}?${params.toString()}`;
      console.log('Generated auth URL:', finalUrl);
      
      return finalUrl;
    } catch (error) {
      console.error("Error getting authenticator URL:", error.message);
      throw error;
    }
  }
  async getLogoutUrl(redirectUri = this.redirectUri) {
    try {
      const config = await this.getOpenIdConfig();
      const endSessionEndpoint = config.end_session_endpoint.replace(
        this.baseUrl,
        'http://localhost:8080/auth'
      );
      
      return `${endSessionEndpoint}?redirect_uri=${encodeURIComponent(redirectUri)}`;
    } catch (error) {
      console.error("Error getting logout URL:", error.message);
      throw error;
    }
  }
}

module.exports = { KeycloakOAuth2Client };