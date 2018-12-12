'use strict'
var mongoose = require('mongoose');

var quizItemSchema = mongoose.Schema({

        question     : String,
        answer       : String,
        hint         : String,
        imageUrl     : Date
    

});


module.exports = mongoose.model('quizItem', quizItemSchema);