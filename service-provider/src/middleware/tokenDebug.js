// src/middleware/tokenDebug.js
const jwt = require('jsonwebtoken');

const tokenDebug = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (token) {
    try {
      const decoded = jwt.decode(token);
      console.log('Token debug:', {
        iss: decoded.iss,
        sub: decoded.sub,
        aud: decoded.aud
      });
    } catch (err) {
      console.error('Token debug error:', err);
    }
  }
  next();
};

module.exports = tokenDebug;