'use strict'


/*Express Router Root: /
  Tehtävä: Huolehtii kirjautumisesta, sekä profiilisivun näyttämisestä ja muokkaamisesta.
  */

var path = require('path');
var User = require('../models/user');


//huom. routet on wrapattu funktioon, jonka parametreina app ja passport. Tämä sen takia, että
//passport käyttää osaa routeista kirjautumisen määrittelyssä.
module.exports = function(app, passport) {

//kirjautumissivu
app.get('/', function(req, res, next) {
  

  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

//LOGIN-ROUTE: successRedirect kuvaa onnistunutta kirjautunutta, failureRedirect epäonnistunutta
app.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // ohjataan käyttäjä profiili sivulle.
  failureRedirect : '/?login=failed', // annetaan url:ssa parametri, jotta Vue tietää että kirjautuminen epäonnistui.
  failureFlash : true // flash-message, ei tarpeellinen tässä sovelluksessa.
}));

//SIGNUP-ROUTE: sama logiikka kuin yllä
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile',
  failureRedirect : '/?signup=failed', 
  failureFlash : true 
}));


app.get('/profile', isLoggedIn, (req, res, next) => { //huom. isLoggedIn middleware
  
  res.sendFile(path.join(__dirname, '../public_auth', 'profile.html'));
});

app.get('/edit-profile', isLoggedIn, (req, res, next) => { //huom. isLoggedIn middleware
  
  res.sendFile(path.join(__dirname, '../public_auth', 'edit-profile.html'));
});

//profiilin päivitys, post-request parametreina saadaan uusi ikä ja email
app.post('/update-profile', isLoggedIn, (req, res) => {

  var age = req.body.age;
  var email = req.body.email;

  

  //req.user sisältää kirjautuneen käyttäjän tiedot, sen avulla päivitetään tietokanta
  User.findOne( {'local.username': req.user.local.username}, function (err, doc) {
    console.log(doc)
    doc.local.email = email;
    doc.local.age = age;
    doc.save(function (err) {
      if (err) {
        console.log(err);
      }

      res.status(200).send();
    });
  });
    

  
});


//route, joka palauttaa fronttiin kirjautuneen käyttäjän usernamen. Saatetaan tarvita jossain vaiheessa.
app.get('/userdata', isLoggedIn, (req, res, next) => {
  
  User.findOne( {  'local.username' : req.user.local.username  } ).lean()
  .exec(function(err, user) {
    return res.json(JSON.stringify(user.local));
  })
  
});

//passport.js:n logout-route, kirjaa käyttäjän ulos.
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

