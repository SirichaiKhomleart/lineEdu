const user = require('../DBaction/user')
const classroom = require('../DBaction/classroom')
const classCode = require('../DBaction/classCode')

function joinClass(by, classCode, classID, from) {
    if (by == "Public") {
        user.joinClassAsCo(classCode, classID, from)
        classroom.addCo(classCode, classID, from)
        classCode.deleteClassCodePrivate(classCode)
    } else {
        user.joinClassAsStudent(classCode, classID, from)
        classroom.addStudent(classCode, classID, from)
    }
}


module.exports = {
    joinClass
};