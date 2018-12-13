'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var genreSchema = new Schema({

    name         : String,
    questionAmount : Number,
    imageUrl : String
    

});


module.exports = mongoose.model('genre', genreSchema);