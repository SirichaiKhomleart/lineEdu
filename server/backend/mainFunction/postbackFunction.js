const user = require('../DBaction/user')
const classroom = require('../DBaction/classroom')
const classCodes = require('../DBaction/classCode')
const messageFunction = require('./messageFunction.js');


async function joinClass(by, classCode, classID, className, from, reply_token) {
    console.log(by);
    console.log(classCode);
    console.log(classID);
    console.log(from);

    if (by == "Private") {
        let result = await user.joinClassAsCo(classCode, classID, from)
        await classroom.addCo(classCode, classID, from)
        await classCodes.deleteClassCodePrivate(classCode)
        if (result.nModified === 0) {
            messageFunction.replyText(reply_token,"You are already be a instructor assistant of " + className + " class.")
        } else {
            messageFunction.replyText(reply_token,"Welcome to the " + className + " class.");
        }
    } else {
        let result2 = await user.joinClassAsStudent(classCode, classID, from)
        await classroom.addStudent(classCode, classID, from)
        if (result2.nModified === 0) {
            messageFunction.replyText(reply_token,"You are already be a student of " + className + " class.")
        } else {
            messageFunction.replyText(reply_token,"Welcome to the " + className + " class. You will get notifications from this class' activities.");
        }
    }


}


module.exports = {
    joinClass
};