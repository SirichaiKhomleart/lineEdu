'use strict'

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const request = require('request') 
// var Comment = require('./model/comments');

var app = express();
var router = express.Router();

const port = process.env.API_PORT || 8080;
const hostname = '127.0.0.1'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer OJ3D0AttKuaKVKS4+zpihBarJ0e+YQ8y9NISQfonTvbCBw6Fzms7dEPifCsonk25u+9xMXGUhG31BPel4QW48aSkwiclb45M/rTSnejiAGnC0OmNz3Ai5SfOxtgxCe7KVOPdJZGRaokTXL8P1crXngdB04t89/1O/w1cDnyilFU='
}
const {WebhookClient} = require('dialogflow-fulfillment');
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

router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

app.use('/api', router);

router.route('/').get(function(req, res) {
    // do what for get request in /api/
    //res.json({ message: 'API Initialized!'});
 }).post(async function(req, res) {
    // do what for post request in /api/
    if (!req.body) {
        return res.sendStatus(400);
    }
    res.setHeader('Content-Type', 'application/json');
    console.log(req.body);
    let responseObj = {
        "fulfillmentText": "ไม่ให้สร้างโว้ย",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": ["ไม่ให้สร้างโว้ย"]
                }
            }
        ]
    }
    console.log(responseObj);
    await res.json(responseObj);
 });


app.listen(port, function() {
    console.log(`api running on port ${port}`);
});

// -----LINE fuction ------//
const projectId = 'lineeducation-949ee'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'dialogflow-lodqfr@lineeducation-949ee.iam.gserviceaccount.com';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './lineeducation-949ee-4323881c6fda.json'
});

const sessionPath = sessionClient.sessionPath(projectId, sessionId);


function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
	})
}

app.get('/webhook', (req, res) => {
	// push block
	let msg = "hello world"
	push(msg);
	res.send(msg)
})

// Reply
app.post('/webhook', async (req, res) => {
	// reply block
	let reply_token = req.body.events[0].replyToken;
	let msg = req.body.events[0].message.text;
	if (msg === "Liff") {
		msg = "line://app/1609431105-xZP8dQy5"
	} else {
        await dialogFlow(msg, function(result) {
            msg = `Intent: ${result.intent.displayName} | Feedback: ${result.fulfillmentText}`;
        });
    }
	reply(reply_token,msg)
})

function push(msg) {
	let body = JSON.stringify({
		// push body
		to: 'Uc9e7b76b053d02ed8627898987f219a3',
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
	})
	curl('push', body)
}

function reply(reply_token, msg) {
	let body = JSON.stringify({
		// reply body
		replyToken: reply_token,
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
	})
	curl('reply', body);
}

async function dialogFlow(msg,callback) {
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: msg,
                languageCode: languageCode,
            },
        },
    };
    await sessionClient.detectIntent(request).then(async responses => {
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        console.log(`  Result: ${JSON.stringify(result)}`);
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
            callback(result);
        } else {
            console.log(`  No intent matched.`);
        }
    }).catch(err => {
        console.error('ERROR:', err);
    });
}