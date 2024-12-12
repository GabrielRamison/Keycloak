// src/controllers/homeController.js
const KeycloakService = require('../service/keycloakService');

class HomeController {
  static async handle(req, res) {
    const accessToken = req.cookies.accessToken;
    
    if (accessToken) {
      try {
        const userInfo = await KeycloakService.getUserInfo(accessToken);
        
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
