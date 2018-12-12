'use strict'
var path = require('path');
var User = require('../models/user');

module.exports = function(app, passport) {

//kirjautumissivu
app.get('/', function(req, res, next) {
  console.log("es");

  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // ohjataan käyttäjä profiili sivulle.
  failureRedirect : '/?login=failed', // annetaan url:ssa parametri, jotta Vue tietää että kirjautuminen epäonnistui.
  failureFlash : true // flash-message, ei tarpeellinen tässä sovelluksessa.
}));

app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/?signup=failed', 
  failureFlash : true 
}));

app.get('/profile', isLoggedIn, (req, res, next) => { //huom. isLoggedIn middleware
  console.log(req.user);
  res.sendFile(path.join(__dirname, '../public_auth', 'profile.html'));
});

app.get('/edit-profile', isLoggedIn, (req, res, next) => { //huom. isLoggedIn middleware
  
  res.sendFile(path.join(__dirname, '../public_auth', 'edit-profile.html'));
});

app.get('/userdata', isLoggedIn, (req, res, next) => {
  
  User.findOne( {  'local.username' : req.user.local.username  } ).lean()
  .exec(function(err, user) {
    return res.json(JSON.stringify(user.local));
  })
  
})


app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

};

function isLoggedIn(req, res, next) {

  // tarkastetaan, että käyttäjän on autentikoitu
  if (req.isAuthenticated())
      return next();

  // jos ei ole, ohjataan kirjautumissivulle
  res.redirect('/');
}
