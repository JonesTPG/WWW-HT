'use strict'

//var createError = require('http-errors');
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
app.use(bodyParser.json()); // get information from html forms
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
  // Website you wish to allow to connect
//res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)

  // Request methods you wish to allow
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

  // Request headers you wish to allow
res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

  // Pass to next layer of middleware
next()
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.sendFile(path.join(__dirname, './public', 'error.html'));
// });



module.exports = app;
