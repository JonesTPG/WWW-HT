'use strict'


/* Tulos-objekti, sisältää neljä listaa, joissa tietoja quizissa esiintyvistä kysymyksistä
   sekä vastaukset kolmessa eri muodossa. Lisäksi sisältää metadataa kuten päivämäärän. */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resultSchema = new Schema({

        genre        : String,
        username     : String,
        score        : Number,
        amount       : Number,
        difficulty   : String,
        right        : Number,
        date         : Date,
        questions    : [],
        answers      : [],
        rightAnswers : [],
        booleanAnswers: []
});


module.exports = mongoose.model('result', resultSchema);