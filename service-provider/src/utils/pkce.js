// utils/pkce.js
const crypto = require('crypto');

const pkceStore = {};

const generatePKCE = () => {
  const verifier = crypto.randomBytes(32).toString('base64url');
  const challenge = crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64url');
  return { verifier, challenge };
};

const storePKCE = (state, pkceData) => {
  pkceStore[state] = pkceData;
};

const getPKCE = (state) => {
  return pkceStore[state];
};

const clearPKCE = (state) => {
  delete pkceStore[state];
};

module.exports = {
  generatePKCE,
  storePKCE,
  getPKCE,
  clearPKCE
};