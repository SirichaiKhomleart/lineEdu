const classCode = require('../model/classCode')

module.exports = {
    getClassCode: async () => {
        let result = await classCode.find({}, (err) => {
            if (err) {
                console.log(err);
            }
        })
        return result
    },
    addClassCode: (data) => {
        (new classCode(data)).save((err, newClassCode) => {
            if (err)
                console.log(err);
            else if (!newClassCode)
                console.log(400);
        })
    },
    insertClassCodeBoth: async (data,res,next) => {
        let updatedClassCode = await classCode.updateOne(
            {},
            { $addToSet: { privateKeyList: data.privateKey, publicKeyList: data.publicKey } }
        )
        return updatedClassCode
    },
    insertClassCodePrivate: async (data,res,next) => {
        let updatedClassCode = await classCode.updateOne(
            {},
            { $addToSet: { privateKeyList: data } }
        )
        return updatedClassCode
    },
    deleteClassCodePrivate: async (data,res,next) => {
        let updatedClassCode = await classCode.updateOne(
            {},
            { $addToSet: { privateKeyList: data } }
        )
        return updatedClassCode
    }
}