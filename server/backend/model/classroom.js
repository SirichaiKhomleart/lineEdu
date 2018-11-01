'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var classroomSchema = new Schema({
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
        type: Date,
        default: Date.now
    },
    classStatus: {
        type: String
    },
    classScore: {
        type: Array
    },
    classMoreDetailList: {
        type: Array
    },
    classCoList: {
        type: Array
    },
    classStudentList: {
        type: Array
    }
});

module.exports = mongoose.model('classroom', classroomSchema, 'classrooms');