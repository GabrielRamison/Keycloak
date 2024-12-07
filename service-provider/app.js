// app.js
const express = require('express');
const session = require('express-session');
const config = require('./src/config/enviroment');
const passport = require('./src/config/passport');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);

app.listen(config.PORT, () => {
  console.log(`Service Provider running on port ${config.PORT}`);
  console.log('Environment variables loaded:');
  console.log('KEYCLOAK_URL:', config.EXTERNAL_KEYCLOAK_URL);
  console.log('KEYCLOAK_REALM:', config.KEYCLOAK.REALM);
  console.log('KEYCLOAK_CLIENT_ID:', config.KEYCLOAK.CLIENT_ID);
});