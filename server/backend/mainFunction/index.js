const dialogflowFunction = require('../dialogflow/index.js');
const messageFunction = require('./messageFunction.js');
const request = require('request') 
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer svGsqRZqRcnxR0tOJZXWqZxiioJXQGv7btlA4iyuAT5KWbqTg+9y6N5i1J6ir/x2u+9xMXGUhG31BPel4QW48aSkwiclb45M/rTSnejiAGmiQN0j+ZwcJYBH/IKvBLM/maV/yWBuh1eThXdOwVt4iFGUYhWQfeY8sLGRXgo3xvw='
}
var user = require('../model/user.js');

async function mainServerHandle(body){
    console.log("in main function")
    let reply_token = body.replyToken;
    let incomingMsg = body.message.text;
    let userId = body.source.userId;
    if (checkRegistedUser(body)) {
        await dialogflowFunction.passToDialogFlow(incomingMsg, function(result) {
            switch (result.intent.displayName) {
                case 'createClassroom':
                let replyMessage = {
                    "type": "template",
                    "template": {
                        "type": "confirm",
                        "actions": [
                            {
                            "type": "uri",
                            "label": "OK",
                            "uri": "line://app/1609431105-7LGnWqlK"
                            }
                        ],
                        "text": "You can fill the form in this link to create a new classroom."
                        }
                    }
                    messageFunction.replyTemplate(reply_token,replyMessage)
                    break;
                case 'joinClassroom':
                    console.log("intent join class");
                    break;
                case 'createAnnouncement':
                    console.log("intent create ann");
                    break;
                default:
                messageFunction.replyText(reply_token,"not in any intent.")
            }
        });
    } else {
        messageFunction.replyText(reply_token,"Please, fill some information before start use our service in this link: line://app/1609431105-p3Dw1zkg")
    }
}

function checkRegistedUser(userId) {
    user.findOne({ userID: userID }, (err, data) => {
        if (data == null) {
            return true
        } else {
            return false
        }
    })
}

function addNewUser(message) {
    let { userID } = message.source.userId
    let { reply_token } = message.reply_token
    user.findOne({ userID: userID }, (err, data) => {
        if (data == null) {
            messageFunction.replyText(reply_token,"welcome to LINE Education. Please, fill some information before start use our service in this link: line://app/1609431105-p3Dw1zkg")
        } else {
            messageFunction.replyText(reply_token,"welcome back to LINE Education.")

        }
    })
}

function joinGroup(message) {
    
}

function leaveGroup(message) {
    
}

module.exports = {
    mainServerHandle,addNewUser,joinGroup,leaveGroup
};