// src/controllers/getUserInfoController.js
class GetUserInfoController {
    static async handle(req, res) {
      const oAuth2Client = new KeycloakOAuth2Client(config.KEYCLOAK);
      try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
          return res.redirect('/');
        }
  
        const userInfo = await oAuth2Client.getUserInfo(accessToken);
        res.send(`
          <!DOCTYPE html>
          <html>
            <body>
              <h1>User Info</h1>
              <p>Name: ${userInfo.name}</p>
              <p>Email: ${userInfo.email}</p>
              <p>Username: ${userInfo.preferred_username}</p>
            </body>
          </html>
        `);
      } catch (err) {
        console.error(err);
        res.status(500).json({
          status: 500,
          message: 'An unexpected error occurred'
        });
      }
    }
  }
  
  module.exports = {
    
    GetUserInfoController
  };