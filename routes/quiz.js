'use strict'

var express = require('express');
var router = express.Router();
var path = require('path');
var Genre = require('../models/genre');
var QuizItem = require('../models/quizItem');
var Result = require('../models/result');

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

router.post('/get-questions', function (req, res) {
    
    var amount = req.body.amount;
    var genre = req.body.genre;
    let dataList = [];
    var data;
 
    QuizItem.find({genreName: genre})
    .lean()
    .exec(function(err, results) {
    var data = results;
    var count = data.length;
    
    
    

    for (var i=0; i<amount; i++) {      //otetaan amountin verran kysymyksiä, ja randomisoidaan kysymykset
        var random = Math.floor(Math.random()*count);
        dataList[i] = data[random]
    }
        
    for (let i=0; i<dataList.length; i++) {
            dataList[i].answer = null;          //poistetaan vastaukset fronttiin lähtevästä datasta.
    }

    
    res.json(JSON.stringify(dataList));
  });

});

router.post('/save-results', (req, res) => {
    var userAnswers = req.body.answerdata;
    var amount = req.body.amount;
    var genre = req.body.genre;

    
    
    //console.log( "saadut kysymykset:" + questiondata[1].question );
    QuizItem.find({genreName: genre})
    .lean()
    .exec(function(err, results) {
    var data = results;
    var count = data.length;
    var quizResult = [];
    for (var i=0; i<count; i++) {
        for (var j=0; j<amount; j++) {
            
            if (data[i].question == userAnswers[j].question) {
                

                if ( data[i].answer == userAnswers[j].answer ) { //vastaus on oikein
                    
                    quizResult[j] = {  answer: true, score: userAnswers[j].score,
                    userAnswer: userAnswers[j].answer, rightAnswer: userAnswers[j].answer,
                    question: userAnswers[j].question  };
                }
                else {
                    quizResult[j] = {  answer: false, score: -100,
                    userAnswer: userAnswers[j].answer, rightAnswer: data[i].answer,
                    question: userAnswers[j].question  };
                }
            }
        }
    }

    var right = 0;
    var score = 0;
    var questions = [];
    var answers = [];
    var rightAnswers = [];
    var booleanAnswers = [];

    for (var i=0; i<quizResult.length; i++) {
        booleanAnswers[i] = quizResult[i].answer;
        questions[i] = quizResult[i].question;
        answers[i] = quizResult[i].userAnswer;
        rightAnswers[i] = quizResult[i].rightAnswer;     
        
        if (quizResult[i].answer == true) {
            right++;
        }
        score = score + quizResult[i].score;
    }

    var newResult            = new Result();

       
        newResult.genre = genre;
        newResult.username = req.user.local.username;
        newResult.score = score;
        newResult.amount = amount;
        newResult.difficulty  = "";
        newResult.right = right;
        newResult.date = Date.now();
        newResult.questions = questions;
        newResult.answers = answers;
        newResult.rightAnswers = rightAnswers;
        newResult.booleanAnswers = booleanAnswers;

        
        newResult.save(function(err, result) {
            if (err)
                throw err;
            
            res.json(JSON.stringify(result._id));
        
        });

    

    });
    

});

router.get('/results', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_auth', 'results.html'));
});

router.post('/get-results', isLoggedIn, function(req, res) {
    var id = req.body.id;
    console.log(id);

    Result.findOne({_id: id}).lean().exec(function(err, result) {
        
        res.json(JSON.stringify(result));
    });

});

router.get('/startquiz', isLoggedIn, function (req, res) {
    var genre = req.query.genre;
    var amount = req.query.amount;
    var username = req.user.local.username;
    console.log(genre+amount+username);
    //res.json({genre: genre, amount: amount, username: username});
    //res.redirect('/quiz/newquiz?genre='+genre+'&amount='+amount+'&user='+username);
    res.redirect('/quiz/newquiz?genre='+genre+'&amount='+amount);


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