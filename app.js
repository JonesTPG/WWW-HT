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


//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var configDB = require('./config/database');

var app = express();

//yhdistetään databaseen
var db = mongoose.connect(configDB.url, function(error){
  if(error) console.log(error);

      console.log("connection successful");
});




app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);



// required for passport
app.use(session({ secret: 'LUTWEB2K18' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// pass passport for configuration
require('./config/passport')(passport);

require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport

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
