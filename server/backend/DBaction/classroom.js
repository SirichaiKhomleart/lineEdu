const classroom = require('../model/classroom')

module.exports = {
    getClassById: async (classId) => {
        let res = await classroom.findById(classId, (err) => {
            if (err)
                console.log(err)
        })
        return res
    },
    getAllClassroom: (res) => {
        classroom.find({}, (err, classroom) => {
            if (err)
                res.send(err)
            else if (!classroom)
                res.send(404)
            else{
                res.send(classroom)
            }
        })
    },
    addClassroom: (data, res, next) => {
        (new classroom(data)).save((err, newClassroom) => {
            if (err)
                res.send(err)
            else if (!newClassroom)
                res.send(400)
            else{
                res.send(newClassroom)
                next(newClassroom)
            }
        })
    },
    updateClassroom: (req, res, next) => {
        classroom.update(req.body, (err, updateClassroom) => {
            if (err)
                res.send(err)
            else if (!updateClassroom)
                res.send(400)
            else
                res.send(req.body)
            next(updateClassroom)
        })
    },
    findByCode: async (classCode) => {
        let byPublic = await classroom.findOne({'classPublicKey': classCode})
        let byPrivate = await classroom.findOne({'classPrivateKey': classCode})
        if (!byPublic && byPrivate) {
            return {
                classroom: byPrivate,
                by: "Private"
            }
        } else if (byPublic && !byPrivate) {
            return {
                classroom: byPublic,
                by: "Public"
            }
        } else {
            return null
        }

    },
    addCo: (classCode, classID, from) => {
        let result = classroom.updateOne({ _id: classID },{ $addToSet: { classCoList: from }})
        classroom.updateOne({ _id: classID },{ $pull: { classPrivateKey: classCode }})
    },
    addStudent: async (classCode, classID, from) => {
        let result = await classroom.updateOne({ classPublicKey: classCode, 'classStudentList.userID': {$ne: from} },
            { $push: { classStudentList: { userID: from }}}
        )
        console.log(result);
    },
    getChapListByClassId: async (classID) => {
        let result = await classroom.findOne({_id: classID},{'classLec.chapterName': 1, 'classLec._id': 1})
        return result
    },
    insertChapter: async (classID,chapterName) => {
        let result = await classroom.updateOne({_id: classID, 'classLec.chapterName': {$ne: chapterName}},
            { $push: { classLec: { chapterName: chapterName }}}
        )
        return result
    },
    insertUploadHis: async (data,classID,chapID) => {
        let result = await classroom.updateOne({_id: classID, 'classLec._id': chapID},
            { $push: { 'classLec.$.uploadedList': data}}
        )
        return result
    },
}