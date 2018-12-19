'use strict'
var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // lokaali rekisteröitymis-strategia = käyttäjänimi + salasana
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) {
       
      
        process.nextTick(function() {

        // etsitään käyttäjänimi, joka vastaa formista tullutta
        // jos sellainen löytyy, estetään rekisteröinti
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // palautetaan virheet
            if (err)
                return done(err);

            
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                // kyseessä uusi käyttäjä, luodaan mongoose dokumentti ja tallennetaan
                var newUser            = new User();

                
                newUser.local.username = username;
                newUser.local.password = newUser.generateHash(password);
                newUser.local.email = "";
                newUser.local.created = Date.now();
                newUser.local.age = "";
                newUser.local.records = [];

               
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

     //lokaali kirjautumis-strategia

    passport.use('local-login', new LocalStrategy({
        
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
    },
    function(req, username, password, done) { // parametreina formista saatu username ja salasana

        //katsotaan, löytyykö käyttäjä tietokannasta
        User.findOne({ 'local.username' :  username }, function(err, user) {
            
            if (err)
                return done(err);

            // käyttäjää ei löytynyt
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); 

            // käyttäjä löytyi, salasana kuitenkin väärä
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); 

            // kirjautuminen onnistui
            return done(null, user);
        });

    }));

};



    


