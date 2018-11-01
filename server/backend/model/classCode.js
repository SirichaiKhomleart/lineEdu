'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classCodeEntitySchema = new Schema({
    publicKeyList: Array,
    privateKeyList: Array
});

module.exports = mongoose.model('classCode', classCodeEntitySchema, 'classCodes');