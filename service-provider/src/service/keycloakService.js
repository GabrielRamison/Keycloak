// src/service/keycloakService.js
const axios = require("axios");
const config = require("../config/environment");

class KeycloakService {
  static async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        `${config.INTERNAL_KEYCLOAK_URL}/auth/realms/${config.KEYCLOAK.REALM}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      throw new Error("Failed to fetch user info");
    }
  }
}

module.exports = KeycloakService;
