const jsonServer = require('json-server')
const server = jsonServer.create()
const path = require('path')
const router = jsonServer.router(path.join(__dirname, './db.json'))  //D:\4.programming\ANGULAR\sidebar-reused-release1.0.0\reusable-sidebar\db.json

const middlewares = jsonServer.defaults()

var passport = require('passport');   // <1>
var Strategy = require('passport-http').BasicStrategy;
var db = require('./db/index');


// Configure the Basic strategy for use by Passport.    // <2>
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

// http -a jack:secret localhost:3000/email     // <3>
server.get('/email',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, email: req.user.emails[0].value });
  });

server.use(middlewares)


// http localhost:3000/wines
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on 3000')
})