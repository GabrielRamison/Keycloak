// src/controllers/homeController.js
const { KeycloakOAuth2Client } = require('../clients/keycloak-oauth2-client');

class HomeController {
  static async handle(req, res) {
    const accessToken = req.cookies.accessToken;
    
    if (accessToken) {
      try {
        const oAuth2Client = new KeycloakOAuth2Client();
        console.log('Requesting user info with token:', accessToken.substring(0, 20) + '...');
        const userInfo = await oAuth2Client.getUserInfo(accessToken);
        
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Welcome</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <h1>Welcome ${userInfo.name || 'User'}</h1>
              <div>
                <h2>User Profile</h2>
                <p>Email: ${userInfo.email || 'Not available'}</p>
                <p>Username: ${userInfo.preferred_username || 'Not available'}</p>
                <hr/>
                <a href="/logout">Logout</a>
                <a href="/userinfo">View Full Profile</a>
              </div>
            </body>
          </html>
        `);
      } catch (error) {
        console.error('Home page error:', error);
        res.clearCookie('accessToken');
        res.redirect('/login');
      }
    } else {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Welcome</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>Welcome to Service Provider</h1>
            <div>
              <a href="/login">Login</a>
              <span> | </span>
              <a href="/register">Register</a>
            </div>
          </body>
        </html>
      `);
    }
  }
}

module.exports = HomeController;