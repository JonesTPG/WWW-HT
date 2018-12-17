'use strict'
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