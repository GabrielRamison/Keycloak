// config/environment.js
require('dotenv').config();

const requiredEnvVars = [
  'KEYCLOAK_URL',
  'KEYCLOAK_REALM',
  'KEYCLOAK_CLIENT_ID',
  'KEYCLOAK_CLIENT_SECRET'
];

const config = {
  EXTERNAL_KEYCLOAK_URL: process.env.KEYCLOAK_URL?.replace('keycloak', 'localhost'),
  INTERNAL_KEYCLOAK_URL: process.env.KEYCLOAK_URL,
  APP_URL: `http://localhost:${process.env.PORT || 3002}`,
  PORT: process.env.PORT || 3002,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-secret-key',
  KEYCLOAK: {
    REALM: process.env.KEYCLOAK_REALM,
    CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET
  },
  VERIFY_EMAIL_REDIRECT: `http://localhost:${process.env.PORT || 3002}/verified` // Nova URL
};

module.exports = config;