'use strict'


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');



var quizRouter = require('./routes/quiz');
var dataRouter = require('./routes/data');
var createRouter = require('./routes/create');


var configDB = require('./config/database');

var app = express();

//yhdistetään databaseen
var db = mongoose.connect(configDB.url, function(error){
  if(error) console.log(error);

      console.log("connection successful");
});




app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json()); // informaatio html-formseista
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));






// required for passport
app.use(session({ secret: 'LUTWEB2K18' })); // session-salaisuus, jonka avulla token luodaan
app.use(passport.initialize());
app.use(passport.session()); // pysyvä kirjautuminen
app.use(flash()); // flash-message -tuki, ei tarpeellinen tässä sovelluksessa


require('./config/passport')(passport); // configuroidaan passport

require('./routes/index.js')(app, passport); // määritellään auth-routet

app.use('/quiz', quizRouter);
app.use('/data', dataRouter);
app.use('/create', createRouter);

app.use(function (req, res, next) {
  

  
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  
next()
});


module.exports = app;
