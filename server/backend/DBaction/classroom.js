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
    }
}