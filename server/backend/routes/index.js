const classroomAction = require('../DBaction/classroom')
const userAction = require('../DBaction/user')
const mainServerFunction = require('../mainFunction/index.js');
const user = require('../model/user')
const classroom = require('../model/classroom')

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
    
    router
        .post('/insertClassroom', async (req, res) => {
            console.log("insertClassroom coming request");
            classroomAction.addClassroom(req.body,res,async (newClass) => {
                await user.update(
                    { userID: req.body.classOwner },
                    { $push: { userCoClassList: newClass._id } }
                )
            })
        })
    
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
        .post('/getAllClassroom', async (req, res) => {
            console.log("getAllClassroom coming request");
            classroomAction.getAllClassroom(res);
        })
    
    // router.route('/')
        // .get(function(req, res) {
        //     // do what for get request in /api/
        //     //res.json({ message: 'API Initialized!'});
        //  }).post(async function(req, res) {
        //     // do what for post request in /api/
        //     if (!req.body) {
        //         return res.sendStatus(400);
        //     }
        //     res.setHeader('Content-Type', 'application/json');
        //     console.log(req.body);
        //     let responseObj = {};
        //     if (req.body && req.body.queryResult && req.body.queryResult.intent && req.body.queryResult.intent.displayName) {
        //         console.log(req.body.queryResult.intent.displayName);
        //         switch (req.body.queryResult.intent.displayName) {
        //             case "createClassroom":
        //                 responseObj =  await createClassIntent.createClass();
        //                 break;
        //             case "listClassroom":
        //                 responseObj =  await listClassIntent.listClass();
        //                 break;
        //             case "listCommand":
        //                 responseObj =  await listCommandIntent.listCommand();
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        //     console.log("response Obj : ",responseObj);
        //     res.json(responseObj);
        //  });
}