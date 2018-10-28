//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    userID: {
        type: String,
        required: true
    },
    userDisplayName: {
        type: String,
        required: true
    },
    userPicURL: {
        type: String
    },
    userFullName: {
        type: String
    },
    userRegTimeStamp: {
        type: Date,
        default: Date.now
    },
    userEmail: {
        type: String
    },
    userPhoneNum: {
        type: String
    },
    userJoinedClassList: {
        type: Array
    },
    userCoClassList: {
        type: Array
    },
    userProjectList: {
        type: Array
    }
});

module.exports = mongoose.model('user', userSchema, 'users');