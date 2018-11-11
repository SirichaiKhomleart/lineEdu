'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moreDetailStudentSchema = new Schema({
    fieldName: String,
    fieldDetail: String
})

var studentJoinedSchema = new Schema({
    userID: String,
    JoinedTimpStamp: {
        type: Date,
        default: Date.now
    },
    moreDetail: [moreDetailStudentSchema]
})

var uploadedLecSchema = new Schema({
    lecName: String,
    lecDesc: String,
    lecUploader: String,
    lecURL: String,
    lecUploadTimeStamp: {
        type: Date,
        default: Date.now
    },
    lecUpdateTimeStamp: {
        type: Date,
        default: Date.now
    }
})

var chapterLecSchema = new Schema({
    chapterName: {
        type: String,
        unique: true
    },
    uploadedList: [uploadedLecSchema]
})

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
    classStudentList: [studentJoinedSchema],
    classLec: [chapterLecSchema]
});

module.exports = mongoose.model('classroom', classroomSchema, 'classrooms');