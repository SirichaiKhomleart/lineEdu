const classroomAction = require('../DBaction/classroom')
const userAction = require('../DBaction/user')
const classCodeAction = require('../DBaction/classCode')
const mainServerFunction = require('../mainFunction/index.js');
const announcementFunction = require('../mainFunction/announcementFunction.js');
const user = require('../model/user')
const classroom = require('../model/classroom')
const dialogflowFunction = require('../dialogflow/index.js');

module.exports = (router) => {

    router
        .get('/', function(req, res) {
            res.json({ message: 'API Initialized!'});
        });
    
    router
        .get('/testDB', function(req, res) {
            let testClassroom = new classroom({ className: 'testing' });
        
            testClassroom.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("testing insert is completed")
                }
            })
            // mainServerFunction.addNewUser();
        });

    // ******************* Classroom route ******************* //
    router
        .get('/getAllClassroom', async (req, res) => {
            console.log("getAllClassroom coming request");
            classroomAction.getAllClassroom(res);
        })
    
    router
        .post('/insertClassroom', async (req, res) => {
            console.log("insertClassroom coming request");
            classroomAction.addClassroom(req.body,res,async (newClass) => {
                await user.update(
                    { userID: req.body.classOwner },
                    { $push: { userCoClassList: newClass._id } }
                )
                await classCodeAction.insertClassCodeBoth({
                    publicKey: newClass.classPublicKey,
                    privateKey: newClass.classPrivateKey[0]
                }).then(async () => {
                    let data = await classCodeAction.getClassCode()
                    let entriesPublic = await data[0].publicKeyList.map((subData) => {
                        let result = {
                            synonyms: [subData],
                            value: subData
                        }
                        return result
                    })
                    let entriesPrivate = await data[0].privateKeyList.map((subData) => {
                        let result = {
                            synonyms: [subData],
                            value: subData
                        }
                        return result
                    })
                    let sendData = {
                        entries: [...entriesPrivate,...entriesPublic],
                        name: "classCode"
                    }
                    dialogflowFunction.updateEntity("classCode",sendData)
                })
            })
        })

    router
        .post('/getClassById', async (req, res) => {
            console.log("getClassById coming request");
            let result = await classroomAction.getClassById(req.body.classId);
            res.send(result)
        })
    
    // ******************* User route ******************* //
    router
        .post('/addUser', async (req, res) => {
            console.log("addUser coming request");
            let newUser = new user(req.body)
            newUser.save((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send("user is inserted")
                }
            });
        })

    router
        .post('/getUserByUserID', async (req, res) => {
            console.log("getUserByUserID coming request");
            let user = await userAction.findByUserID(req.body.userId);
            res.send(user)
        })

    // ******************* User route ******************* //
    router
        .post('/annoucement', async (req, res) => {
            console.log("annoucement coming request");
            announcementFunction.announce(req,res);
        })

        
}