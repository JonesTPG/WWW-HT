'use strict'

var express = require('express');
var router = express.Router();
var path = require('path');
var Genre = require('../models/genre');

router.get('/', isLoggedIn, function (req, res) {
    res.send('Quiz-router');
  });

router.get('/start', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_auth', 'startquiz.html'));
});

router.get('/genres', function (req, res) {
    
    Genre.find({})
    .lean()
    .exec(function(err, genre) {
        res.json(JSON.stringify(genre));
  });

});

router.get('/startquiz', isLoggedIn, function (req, res) {
    var genre = req.query.genre;
    var amount = req.query.amount;
    var username = req.user.local.username;
    console.log(genre+amount+username);
    //res.json({genre: genre, amount: amount, username: username});
    res.redirect('/quiz/newquiz?genre='+genre+'&amount='+amount+'&user='+username);

});

router.get('/newquiz', isLoggedIn, function(req, res) {
    res.sendFile(path.join(__dirname, '../public_auth', 'quiz.html'));
})





function isLoggedIn(req, res, next) {

    // tarkastetaan, että käyttäjän on autentikoitu
    if (req.isAuthenticated())
        return next();
  
    // jos ei ole, ohjataan kirjautumissivulle
    res.redirect('/');
}

  module.exports = router;