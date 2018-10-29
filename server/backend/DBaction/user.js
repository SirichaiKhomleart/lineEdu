const user = require('../model/user')

module.exports = {
    getUser: (req, res, next) => {
        user.findById(req.body, (err, user) => {
            if (err)
                res.send(err)
            else if (!user)
                res.send(404)
            else
                res.send(user)
            next()
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
    }
}