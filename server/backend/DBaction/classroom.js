const classroom = require('../model/classroom')

module.exports = {
    getClassroom: (req, res, next) => {
        classroom.findById(req.params.id, (err, classroom) => {
            if (err)
                res.send(err)
            else if (!classroom)
                res.send(404)
            else{
                res.send(classroom)
            }
            next(classroom)
        })
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
            { $push: { classStudentList: { userID: from }
        }})
        console.log(result);
    }
}