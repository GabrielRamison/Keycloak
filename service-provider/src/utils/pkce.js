const crypto = require('crypto');

const pkceStore = {};

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generatePKCE() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(
    crypto.createHash('sha256')
      .update(verifier)
      .digest()
  );
  return { verifier, challenge };
}

function storePKCE(state, data) {
  pkceStore[state] = data;
  console.log('Stored PKCE data for state:', state);
}

function getPKCE(state) {
  const data = pkceStore[state];
  console.log('Retrieved PKCE data for state:', state, !!data);
  return data;
}

function clearPKCE(state) {
  delete pkceStore[state];
  console.log('Cleared PKCE data for state:', state);
}

module.exports = {
  generatePKCE,
  storePKCE,
  getPKCE,
  clearPKCE
};