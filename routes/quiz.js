'use strict'

/*Express Router Root: /quiz
  Tehtävä: Huolehtii uuden quizin luomisesta, ja tuloksen tallentamisesta
  */


var express = require('express');
var router = express.Router();
var path = require('path');
var Genre = require('../models/genre');
var QuizItem = require('../models/quizItem');
var Result = require('../models/result');


//ei varsinaista merkitystä, pidetään kuitenkin route ylhäällä yksikkötestejä varten.
router.get('/', function (req, res) {
    res.status(200).send('Quiz-router');
  });


//viedään sivu, jossa quizin valmistelunäkymä
router.get('/start', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_auth', 'startquiz.html'));
});


//palauttaa kaikki kannasta löytyvät genret. Frontissa Vue listaa ne käyttäjälle
router.get('/genres', function (req, res) {
    
    Genre.find({})
    .lean()
    .exec(function(err, genre) {
        res.json(JSON.stringify(genre));
  });

});

//palauttaa fronttiin randomilla valitut kysymykset tietokannasta. jos tarpeeksi kysymyksiä ei löydy,
//palautetaan error-message jonka avulla Vue reagoi.

router.post('/get-questions', function (req, res) {
    
    var amount = req.body.amount; //kysymysten määrä
    var genre = req.body.genre; // valittu genre
    let dataList = [];  
    
 
    QuizItem.find({genreName: genre}) //etsitään kaikki genren kysymykset
    .lean()
    .exec(function(err, results) {
    var data = results;
    var count = data.length;
    
    
    data = shuffle(data); //sekoitetaan lista

    if (count<amount) {  //kysymyksiä ei tarpeeksi, return error
        console.log("error");
        var error  = true;
        res.json(JSON.stringify(error));

    }

    else {
   

        for (var i=0; i<count; i++) {      //otetaan oikean määrän verran kysymyksiä
            
            dataList[i] = data[i];
        }

            
        for (let i=0; i<dataList.length; i++) {
                dataList[i].option3 = dataList[i].answer;
                dataList[i].answer = null;          //vaihdetaan kentän nimi, jotta frontissa vaihtoehdot näkyvät
                                                    //arvoilla option1, option2, option3
        }

    
    res.json(JSON.stringify(dataList)); //palautetaan Vuelle lista, jossa randomit kysymykset genrestä

    }
  });

});


//tallennetaan tulokset quizin jälkeen kantaan.

router.post('/save-results', (req, res) => {
    var userAnswers = req.body.answerdata; //lista, joka sisältää käyttäjän vastaukset
    var amount = req.body.amount;   //kysymysten määrä
    var genre = req.body.genre;     //quizin genre

    
    
    //etsitään tietokannasta kaikki genren kysymykset, ja etsitään sitten sieltä quiziin valitut kysymykset.
    //huom. jos kysymyksiä on genressä todella paljon, ei tämä olisi enää tehokas tapa, mutta tässä tapauksessa
    //tapa käy hyvin, eikä tietokannastakaan tarvitse hakea kun kerran tietoa.

    QuizItem.find({genreName: genre})
    .lean()
    .exec(function(err, results) {
    var data = results;
    var count = data.length;
    var quizResult = []; //lista, johon kerätään tiedot kunkin kysymyksen onnistumisesta

    for (var i=0; i<count; i++) {
        for (var j=0; j<amount; j++) {
            
            if (data[i].question == userAnswers[j].question) {   //vastaava kysymys on löydetty
                

                if ( data[i].answer == userAnswers[j].answer ) { //vastaus on oikein
                    
                    quizResult[j] = {  answer: true, score: userAnswers[j].score,
                    userAnswer: userAnswers[j].answer, rightAnswer: userAnswers[j].answer,
                    question: userAnswers[j].question  };
                }
                else { //vastaus on väärin
                    quizResult[j] = {  answer: false, score: -100,
                    userAnswer: userAnswers[j].answer, rightAnswer: data[i].answer,
                    question: userAnswers[j].question  };
                }
            }
        }
    }

    //koostetaan edellä kerätystä listasta vielä lisätietoja
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

    //tallennetaan edellä hankitut tiedot uuteen result-dokumenttiin, ja
    //talletetaan se tietokantaan

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
            
            //palautetaan Vuelle luodon resultin id. Vue redirectaa käyttäjän tulossivulle, jossa
            //vastaluotu tulos näytetään käyttäjälle.
            res.json(JSON.stringify(result._id));
        
        });

    

    });
    

});

//palautetaan tulossivu
router.get('/results', isLoggedIn, function (req, res) {
    res.sendFile(path.join(__dirname, '../public_auth', 'results.html'));
});

//hakee tietokannasta id:n perusteella tuloksen, joka näytetään Vuessa.
router.post('/get-results', isLoggedIn, function(req, res) {
    var id = req.body.id;
    console.log(id);

    Result.findOne({_id: id}).lean().exec(function(err, result) {
        
        res.json(JSON.stringify(result));
    });

});


//ohjaa käyttäjän quiz-sivulle, kun tiedossa on uuden quizin genre ja kysymysten määrä
router.get('/startquiz', isLoggedIn, function (req, res) {
    var genre = req.query.genre;
    var amount = req.query.amount;
    res.redirect('/quiz/newquiz?genre='+genre+'&amount='+amount);
});

//palauttaa quizin-aloitussivun
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


function shuffle(array) { 
    //Knuth-shuffle, sekoittaa parametrina annetun listan ja palauttaa sekoitetun listan.
    //lähde: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    
    while (0 !== currentIndex) {
  
      
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
     
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  module.exports = router;