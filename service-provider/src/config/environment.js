// src/config/environment.js
require("dotenv").config();

const requiredEnvVars = [
  "KEYCLOAK_URL",
  "KEYCLOAK_REALM",
  "KEYCLOAK_CLIENT_ID",
  "KEYCLOAK_CLIENT_SECRET",
];

// Log para debug inicial
console.log("Loading environment variables:", {
  KEYCLOAK_URL: process.env.KEYCLOAK_URL,
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
});

const config = {
  EXTERNAL_KEYCLOAK_URL: process.env.KEYCLOAK_URL
    ? process.env.KEYCLOAK_URL.replace("keycloak", "localhost")
    : "http://localhost:8080",
  INTERNAL_KEYCLOAK_URL: process.env.KEYCLOAK_URL || "http://keycloak:8080",
  APP_URL: `http://localhost:${process.env.PORT || 3002}`,
  PORT: process.env.PORT || 3002,
  SESSION_SECRET: process.env.SESSION_SECRET || "your-secret-key",
  KEYCLOAK: {
    REALM: process.env.KEYCLOAK_REALM || "myrealm",
    CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || "service-provider",
    CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  VERIFY_EMAIL_REDIRECT: `http://localhost:${
    process.env.PORT || 3002
  }/verified`,
};

// Log para debug da configuração final
console.log("Configuration loaded:", {
  EXTERNAL_KEYCLOAK_URL: config.EXTERNAL_KEYCLOAK_URL,
  INTERNAL_KEYCLOAK_URL: config.INTERNAL_KEYCLOAK_URL,
  REALM: config.KEYCLOAK.REALM,
  CLIENT_ID: config.KEYCLOAK.CLIENT_ID,
});

module.exports = config;
