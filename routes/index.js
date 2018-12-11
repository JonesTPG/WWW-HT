var path = require('path');

module.exports = function(app, passport) {

/* GET home page. */
app.get('/', function(req, res, next) {
  console.log("es");

  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

app.get('/profile', (req, res, next) => {
  
  
  res.sendFile(path.join(__dirname, '../public', 'profile.html'));
});

};


