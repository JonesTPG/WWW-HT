'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizItemSchema = new Schema({

        question     : String,
        answer       : String,
        option1      : String,
        option2      : String,
        hint         : String,
        imageUrl     : String,
        difficulty   : String,
        genre        : { type: Schema.Types.ObjectId, ref: 'genre' },
        genreName    : String
    

});


module.exports = mongoose.model('quizitem', quizItemSchema);