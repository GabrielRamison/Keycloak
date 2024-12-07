// config/environment.js
require('dotenv').config();

const requiredEnvVars = [
  'KEYCLOAK_URL',
  'KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID',
  'KEYCLOAK_CLIENT_SECRET'
];

const config = {
  EXTERNAL_KEYCLOAK_URL: 'http://localhost:8080',
  INTERNAL_KEYCLOAK_URL: 'http://keycloak:8080',
  APP_URL: 'http://localhost:3002',
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key',
  KEYCLOAK: {
    REALM: process.env.KEYCLOAK_REALM,
    CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

module.exports = config;