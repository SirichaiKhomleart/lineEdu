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

function push(userId,msg) {
	let body = JSON.stringify({
		// push body
		to: userId,
		messages: msg
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

function replyTemplate(reply_token, msg) {
	let body = JSON.stringify({
		// reply body
		replyToken: reply_token,
		messages: [
			msg
		]
	})
	console.log("body",body);
	curl('reply', body);
}

function passResponseFromDialogFlow(reply_token,msg){
    replyText(reply_token,msg)
}

module.exports = {
    curl,push,replyText,replyTemplate,passResponseFromDialogFlow
};