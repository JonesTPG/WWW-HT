'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizItemSchema = new Schema({

        question     : String,
        answer       : String,
        hint         : String,
        imageUrl     : String,
        difficulty   : String,
        genre        : { type: Schema.Types.ObjectId, ref: 'genre' }
    

});


module.exports = mongoose.model('quizitem', quizItemSchema);