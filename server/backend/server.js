'use strict'

const mainServerFunction = require('./mainFunction/index.js');
const passLocalFunction = require('./mainFunction/passLocalFunction.js');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var https = require('https')
var fs = require('fs')
var options = {  
    key: fs.readFileSync('./key.pem', 'utf8'),  
    cert: fs.readFileSync('./server.crt', 'utf8')  
};

var app = express();
var router = express.Router();
const routes = require('./routes/index')
const apiPort = process.env.API_PORT || 3001;

// const {WebhookClient} = require('dialogflow-fulfillment');
// const agent = new WebhookClient({request: request, response: response});

// //db config
mongoose.connect('mongodb://127.0.0.1:27017/lineEdu', { useNewUrlParser: true });
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
routes(router)
app.use('/api', router);

// var secureServerAPI = https.createServer(options, app).listen(apiPort, () => {  
//     console.log(`api running on port ${apiPort}`); 
// });
app.listen(apiPort, function() {
    console.log(`api running on port ${apiPort}`);
});

app.post('/getConnect', async (req, res) => {
    console.log("new localhost is connecting ....");
    if (req && req.body && req.body.source) {
        passLocalFunction.setLocalhost(req.body.source,req.body.localhost)
        res.send("setting")
    } else {
        console.log("no match localhost source");
        res.send("incomplete connection")
    }
})

// First post from LINE
router.post('/webhook', async (req, res) => {
    res.send("200")
    console.log("incoming message");
    if (req.body.events && req.body.events[0].type == "follow") {
        mainServerFunction.addNewUser(req.body.events[0])
    } else if (req.body.events && req.body.events[0].type == "join") {
        mainServerFunction.joinGroup(req.body.events[0])
    } else if (req.body.events && req.body.events[0].type == "leave") {
        mainServerFunction.leaveGroup(req.body.events[0])
    }
    if (!(req && req.body && req.body.passing)) {
        if (req.body.events[0].message.text.startsWith("Mak:")) {
            console.log("in Mak with message: " + req.body.events[0].message.text.substring(4))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(4)
            passLocalFunction.passToMak(req.body)
        } else if (req.body.events[0].message.text.startsWith("Nut:")) {
            console.log("in Nut with message: " + req.body.events[0].message.text.substring(4))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(4)
            passLocalFunction.passToNut(req.body)
        } else if (req.body.events[0].message.text.startsWith("Poom:")) {
            console.log("in Poom with message: " + req.body.events[0].message.text.substring(5))
            req.body.events[0].message.text = req.body.events[0].message.text.substring(5)
            passLocalFunction.passToPoom(req.body)
        } else {
            mainServerFunction.mainServerHandle(req.body.events[0])
        }
    } else {
        mainServerFunction.mainServerHandle(req.body.events[0])
    }
})
