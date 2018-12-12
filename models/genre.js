'use strict'
var mongoose = require('mongoose');

var genreSchema = mongoose.Schema({

    name         : String,
    


});


module.exports = mongoose.model('quizItem', quizItemSchema);