'use strict'

const mainServerFunction = require('./mainFunction/index.js');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http')
var https = require('https')
var fs = require('fs')
var options = {  
    key: fs.readFileSync('./key.pem', 'utf8'),  
    cert: fs.readFileSync('./server.crt', 'utf8')  
};
// var Comment = require('./model/comments');

var app = express();
var router = express.Router();

const apiPort = process.env.API_PORT || 3001;

// const {WebhookClient} = require('dialogflow-fulfillment');
// const agent = new WebhookClient({request: request, response: response});

// //db config
// mongoose.connect('mongodb://<dbuser>:<dbpassword>@ds019836.mlab.com:19836/bryandb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
app.use('/api', router);

var secureServerAPI = https.createServer(options, app).listen(apiPort, () => {  
    console.log(`api running on port ${apiPort}`); 
});
// app.listen(apiPort, function() {
//     console.log(`api running on port ${apiPort}`);
// });
//Routing API
router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

// router.route('/').get(function(req, res) {
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

// First post from LINE
app.post('/webhook', async (req, res) => {
    res.send("200")
    if (!(req && req.body && req.body.passing)) {
        if (req.body.events[0].message.text.startsWith("Mak:")) {
            console.log("in Mak with message: " + req.body.events[0].message.text.substring(4))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(4)
            mainServerFunction.passToMak(req.body)
        } else if (req.body.events[0].message.text.startsWith("Nut:")) {
            console.log("in Nut with message: " + req.body.events[0].message.text.substring(4))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(4)
            mainServerFunction.passToNut(req.body)
        } else if (req.body.events[0].message.text.startsWith("Poom:")) {
            console.log("in Poom with message: " + req.body.events[0].message.text.substring(5))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(5)
            mainServerFunction.passToPoom(req.body)
        } else {
            mainServerFunction.mainServerHandle(req.body.events[0])
        }
    } else {
        mainServerFunction.mainServerHandle(req.body.events[0])
    }
})
