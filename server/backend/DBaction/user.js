const user = require('../model/user')

module.exports = {
    getUser: (req, res, next) => {
        user.findById(req.body, (err, user) => {
            if (err)
                console.log(err)
            else if (!user)
                console.log(404)
            else
                console.log(user)
        })
    },
    addUser: (req, res, next) => {
        (new user(req.body)).save((err, newUser) => {
            if (err)
                res.send(err)
            else if (!newUser)
                res.send(400)
            else
                res.send(newUser)
            next(newUser)
        })
    },
    updateUser: (req, res, next) => {
        user.update(req.body, (err, updateUser) => {
            if (err)
                res.send(err)
            else if (!updateUser)
                res.send(400)
            else
                res.send(req.body)
            next()
        })
    },
    findByUserID: async (userId) => {
        let result = await user.find({userID: userId}, (err) => {
            if (err)
                console.log(err)
        })
        return result
    },
    joinClassAsCo: (classCode, classID, from) => {
        let result = user.updateOne({userID: from}, {$push: { userCoClassList: classID }})
    },
    joinClassAsStudent: (classCode, classID, from) => {
        let result = user.updateOne({userID: from}, {$push: { userJoinedClassList: classID }})
    }
}