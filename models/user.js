'use strict'

/* Tietokanta-skeema käyttäjälle, oleellisia tietoja. Huom! Kentät local.username ja local.password ovat ne kentät, jota
   passport.js seuraa kirjautumistapahtumassa */

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local            : {
        username     : String,
        email        : String,
        password     : String,
        age          : String,
        created      : Date,
        records      : []
    }

});

//salasanan hashaus ja suolaus
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
//salasanan tarkistaminen
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);