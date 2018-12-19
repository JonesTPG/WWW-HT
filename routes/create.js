'use strict'

/* Express Router Root: /create
   Tehtävä: Suorittaa vaadittavia toimenpiteitä uuden quizin tekemiseen. Sisältää routet sekä uuden genren,
   että uusien kysymysten tallentamiselle. 
*/



var express = require('express');
var router = express.Router();
var path = require('path');

var Genre = require('../models/genre');
var QuizItem = require('../models/quizItem');
var Result = require('../models/result');

router.get('/', isLoggedIn, function (req, res) {   //lähetetään käyttäjälle createquiz.html
    res.sendFile(path.join(__dirname, '../public_create', 'createquiz.html'));
  });

router.post('/new-genre', isLoggedIn, function (req, res) {
    // tallennetaan uusi genre tietokantaan, ja palautetaan tieto onnistumisesta     
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
    
    var genre = req.body.genre; //kertoo tallennettavien kysymysten genren
    var questions = req.body.questions; //lista, joka sisältää kaiken yksittäiseen kysymykseen liittyvän datan

    for (var i=0; i<questions.length; i++) {
        //tallennetaan jokainen kysymys vuorollaan tietokantaan
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

    res.json({success: true}); //viedään front-endille tieto onnistumisesta
});

router.post('/update-genre', isLoggedIn, function(req, res) {
    //kun uusia kysymyksiä tulee, pitää samalla genren kysymysten määrä päivittää.

    var genre = req.body.genre;     //käsiteltävän genren nimi
    var amount = req.body.amount;   //lisättyjen kysymysten määrä

    Genre.findOne( {'name': genre}, function (err, doc) {
        //etsitään haluttu genre, päivitetään kenttä questionAmount ja tallennetaan kantaan
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
    //viedään käyttäjä kysymysten-teko sivulle
    res.sendFile(path.join(__dirname, '../public_create', 'createquestions.html'));
  });



//middleware, joka tarkistaa että käyttäjä on kirjautunut ennen kuin voi jatkaa
function isLoggedIn(req, res, next) {

    // tarkastetaan, että käyttäjän on autentikoitu
    if (req.isAuthenticated())
        return next();
  
    // jos ei ole, ohjataan kirjautumissivulle
    res.redirect('/');
}

  module.exports = router;