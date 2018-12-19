'use strict'

/* Tietokanta-skeema genrelle, sisältää genren nimen sekä kysymysten määrän. Kysymysten määrä päivittyy aina jos käyttäjä
käy tekemässä uusia kysymyksiä genreen. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var genreSchema = new Schema({

    name         : String,
    questionAmount : Number,
    imageUrl : String
    

});


module.exports = mongoose.model('genre', genreSchema);