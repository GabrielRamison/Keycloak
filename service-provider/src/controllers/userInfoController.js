// src/controllers/userInfoController.js
const KeycloakService = require('../service/keycloakService');

class UserInfoController {
  static async handle(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        return res.redirect('/login');
      }

      const userInfo = await KeycloakService.getUserInfo(accessToken);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>User Info</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>User Info</h1>
            <p>Name: ${userInfo.name || 'Not available'}</p>
            <p>Email: ${userInfo.email || 'Not available'}</p>
            <p>Username: ${userInfo.preferred_username || 'Not available'}</p>
            <p>Subject: ${userInfo.sub || 'Not available'}</p>
            <hr/>
            <a href="/">Back to Home</a>
            <a href="/logout">Logout</a>
          </body>
        </html>
      `);
    } catch (err) {
      console.error('UserInfo error:', err);
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error</title>
          </head>
          <body>
            <h1>Error</h1>
            <p>An unexpected error occurred</p>
            <a href="/">Back to Home</a>
          </body>
        </html>
      `);
    }
  }
}

module.exports = UserInfoController;