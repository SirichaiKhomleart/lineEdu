const dialogflowFunction = require('../dialogflow/index.js');
const request = require('request') 
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer svGsqRZqRcnxR0tOJZXWqZxiioJXQGv7btlA4iyuAT5KWbqTg+9y6N5i1J6ir/x2u+9xMXGUhG31BPel4QW48aSkwiclb45M/rTSnejiAGmiQN0j+ZwcJYBH/IKvBLM/maV/yWBuh1eThXdOwVt4iFGUYhWQfeY8sLGRXgo3xvw='
}

function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
	})
}

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

function replyText(reply_token, msg) {
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

async function mainServerHandle(body){
    console.log("in main function")
    let reply_token = body.replyToken;
	let incomingMsg = body.message.text;
    await dialogflowFunction.passToDialogFlow(incomingMsg, function(result) {
        switch (result.intent.displayName) {
            case 'createClassroom':
                console.log("intent create class");
                break;
            case 'joinClassroom':
                console.log("intent join class");
                break;
            case 'createAnnouncement':
                console.log("intent create ann");
                break;
            default:
                replyText(reply_token,"not in any intent.")
        }
    });
}

async function passToMak(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: 'https://localhostmak3001.localtunnel.me/webhook',
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('mak localhost:')
        if (body != '404') {
            isLocalhostTurnOn = true
        }
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
    })
    return isLocalhostTurnOn
}

async function passToPoom(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: 'https://localhostpoom3001.localtunnel.me/webhook',
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('poom localhost:')
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
        if (body != '404') {
            isLocalhostTurnOn = true
        }
    })
    return isLocalhostTurnOn
}

async function passToNut(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: 'https://localhostnut3001.localtunnel.me/webhook',
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('nut localhost:')
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
        if (body != '404') {
            isLocalhostTurnOn = true
        }
    })
    return isLocalhostTurnOn
}

module.exports = {
    mainServerHandle,passToMak,passToNut,passToPoom
};