'use strict'

/*Express Router Root: /data
  Tehtävä: Palauttaa front-endiin json-muodossa kaikki tulokset
  */

var express = require('express');
var router = express.Router();
var path = require('path');
var Genre = require('../models/genre');
var QuizItem = require('../models/quizItem');
var Result = require('../models/result');


//haetaan tulokset tietokannasta ja palautetaan ne jsonina
router.get('/', function (req, res) {

    Result.find({})
    .lean()
    .exec(function(err, result) {
        res.json(JSON.stringify(result));
  });
    
});

//palauttaa sivun, jonne tulokset lopulta tulevat näkyviin
router.get('/all', function (req, res) {
    res.sendFile(path.join(__dirname, '../public_data', 'data.html'));
});














function isLoggedIn(req, res, next) {

    // tarkastetaan, että käyttäjän on autentikoitu
    if (req.isAuthenticated())
        return next();
  
    // jos ei ole, ohjataan kirjautumissivulle
    res.redirect('/');
}

  module.exports = router;