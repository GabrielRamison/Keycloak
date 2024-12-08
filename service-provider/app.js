const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const config = require('./src/config/environment');
const passport = require('./src/config/passport');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(cookieParser());
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use('/', authRoutes);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

// 1. Primeiro a sessão
app.use(session({
  secret: config.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 2. Depois o passport
app.use(passport.initialize());
app.use(passport.session());

// 3. Agora sim o middleware de log
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Is Authenticated:', req.isAuthenticated());
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 4. Por fim as rotas
app.use('/', authRoutes);

app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`Service Provider running on port ${config.PORT}`);
  console.log('Environment variables loaded:');
  console.log('KEYCLOAK_URL:', config.EXTERNAL_KEYCLOAK_URL);
  console.log('KEYCLOAK_REALM:', config.KEYCLOAK.REALM);
  console.log('KEYCLOAK_CLIENT_ID:', config.KEYCLOAK.CLIENT_ID);
});