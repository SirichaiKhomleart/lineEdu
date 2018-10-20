'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classroomSchema = new Schema({
    classID: {
        type: String
    },
    className: {
        type: String
    },
    classDesc: {
        type: String
    },
    classOwner: {
        type: String
    },
    classPublicKey: {
        type: String
    },
    classPrivateKey: {
        type: Array
    },
    classCreatedTimeStamp: {
        type: Date
    },
    classStatus: {
        type: String
    },
    classScore: {
        type: Array
    },
});

module.exports = mongoose.model('classroom', classroomSchema);