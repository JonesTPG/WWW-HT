'use strict'

var express = require('express');
var router = express.Router();
var path = require('path');
var Genre = require('../models/genre');
var QuizItem = require('../models/quizItem');
var Result = require('../models/result');

router.get('/', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_create', 'createquiz.html'));
  });

router.post('/new-genre', isLoggedIn, function (req, res) {
    var newGenre = req.body.genre;
    console.log(newGenre);

    var genre = new Genre();

    genre.name = newGenre;
    genre.imageUrl = 'http://localhost:3000/images/quiz/default.jpg';
    genre.questionAmount = 0;
    

    genre.save(function(err) {
        if (err)
            throw err;
        
        res.json({success: true});
    });
});

router.post('/save-questions', isLoggedIn, function (req, res) {
    var genre = req.body.genre;
    var questions = req.body.questions;

    for (var i=0; i<questions.length; i++) {
        
        var quizitem = new QuizItem();
        quizitem.genreName = genre;
        quizitem.question = questions[i].question;
        quizitem.hint = questions[i].hint;
        quizitem.answer = questions[i].answer;
        quizitem.option1 = questions[i].option1;
        quizitem.option2 = questions[i].option2;
        quizitem.imageUrl = '../images/quiz/default.jpg';

        quizitem.save(function(err) {
            if (err)
                throw err;
        });

    }

    res.json({success: true});
});

router.post('/update-genre', isLoggedIn, function(req, res) {
    var genre = req.body.genre;
    var amount = req.body.amount;

    Genre.findOne( {'name': genre}, function (err, doc) {
    
        doc.questionAmount = doc.questionAmount + amount;
        
        doc.save(function (err) {
          if (err) {
            console.log(err);
          }
    
          res.status(200).send();
        });
      });

});


router.get('/questions', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_create', 'createquestions.html'));
  });




function isLoggedIn(req, res, next) {

    // tarkastetaan, että käyttäjän on autentikoitu
    if (req.isAuthenticated())
        return next();
  
    // jos ei ole, ohjataan kirjautumissivulle
    res.redirect('/');
}

  module.exports = router;