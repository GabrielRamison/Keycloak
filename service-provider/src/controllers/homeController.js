class HomeController {
    static async handle(req, res) {
      if (req.isAuthenticated()) {
        res.send(`
          <h1>Welcome ${req.user?.displayName || 'User'}</h1>
          <div>
            <h2>User Profile</h2>
            <p>Email: ${req.user?.emails ? req.user.emails[0].value : 'Not available'}</p>
            <p>ID: ${req.user?.id}</p>
            <hr/>
            <a href="/logout">Logout</a>
          </div>
        `);
      } else {
        res.send(`
          <h1>Welcome to Service Provider</h1>
          <div>
            <a href="/login">Login</a>
            <span> | </span>
            <a href="/register">Register</a>
          </div>
        `);
      }
    }
  }
  
  module.exports = HomeController;