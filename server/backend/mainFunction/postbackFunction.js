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
        await user.joinClassAsCo(classCode, classID, from)
        await classroom.addCo(classCode, classID, from)
        await classCodes.deleteClassCodePrivate(classCode)
    } else {
        await user.joinClassAsStudent(classCode, classID, from)
        await classroom.addStudent(classCode, classID, from)
    }
    messageFunction.replyText(reply_token,"Welcome to the " + className + " class. You will get notifications from this class' activities.")
}


module.exports = {
    joinClass
};