const dialogflowFunction = require('../dialogflow/index.js');
const messageFunction = require('./messageFunction.js');
const postbackFunction = require('./postbackFunction.js');

const liffList = require('../constant/liffList');
const createClassIntent = require('../intentFunction/createClassIntent.js');
const listClassIntent = require('../intentFunction/listClassIntent.js');
const listCommandIntent = require('../intentFunction/listCommandIntent.js');
const askClassCode_1_2 = require('../intentFunction/askClassCode_1_2_Intent.js');

var user = require('../model/user.js');

async function mainServerHandle(body){
    console.log("in main function")
    let reply_token = body.replyToken;
    let incomingMsg = body.message.text;
    let userId = body.source.userId;
    let replyMessage = {}
    if (await checkRegistedUser(userId)) {
        await dialogflowFunction.passToDialogFlow(incomingMsg, function(result) {
            switch (result.intent.displayName) {
                case 'createClassroom':
                    replyMessage = {
                        "type": "template",
                        "altText": "this is a buttons template",
                        "template": {
                        "type": "buttons",
                        "actions": [
                            {
                            "type": "uri",
                            "label": "OK",
                            "uri": liffList.createClassroom
                            }
                        ],
                        "text": "You can fill the form in this link to create a new classroom."
                        }
                    }
                    messageFunction.replyTemplate(reply_token,replyMessage)
                    break;
                case 'joinClassroom':
                    messageFunction.passResponseFromDialogFlow(reply_token,result.fulfillmentText)
                    break;
                case 'askClassCode':
                    askClassCode_1_2.findClass(reply_token,result.parameters,result.intent.displayName)
                    break;
                case 'askClassCode - fallback':
                    messageFunction.passResponseFromDialogFlow(reply_token,result.fulfillmentText)
                    break;
                case 'askClassCode2':
                    askClassCode_1_2.findClass(reply_token,result.parameters,result.intent.displayName)
                    break;
                case 'askClassCode2 - fallback':
                    messageFunction.passResponseFromDialogFlow(reply_token,result.fulfillmentText)
                    break;
                case 'makeAnnounce':
                    replyMessage = {
                        "type": "template",
                        "altText": "this is a buttons template",
                        "template": {
                        "type": "buttons",
                        "actions": [
                            {
                            "type": "uri",
                            "label": "OK",
                            "uri": liffList.makeAnnounce
                            }
                        ],
                        "text": "You can fill the form in this link to announce your message to every student in selected classes."
                        }
                    }
                    messageFunction.replyTemplate(reply_token,replyMessage)
                    break;
                case 'uploadLec':
                    replyMessage = {
                        "type": "template",
                        "altText": "this is a buttons template",
                        "template": {
                        "type": "buttons",
                        "actions": [
                            {
                            "type": "uri",
                            "label": "OK",
                            "uri": liffList.makeAnnounce
                            }
                        ],
                        "text": "You can fill the form in this link to upload new lecture note to selected classes."
                        }
                    }
                    messageFunction.replyTemplate(reply_token,replyMessage)
                    break;
                    
                default:
                    messageFunction.replyText(reply_token,"not in any intent.")
            }
        });
    } else {
        messageFunction.replyText(reply_token,`Please, fill some information before start use our service in this link: ${liffList.addUser}`)
    }
}

mainServerHandlePostBack = async (body) => {
    console.log("postback coming")
    let reply_token = body.replyToken;
    let incomingData = body.postback.data;
    let userId = body.source.userId;
    if (await checkRegistedUser(userId)) {
        let list = incomingData.split(":");
        switch (list[0]) {
            case "joinClass":
                postbackFunction.joinClass(list[1],list[2],list[3],list[4],userId,reply_token)
                break;
            default:
                
        }
    } else {
        messageFunction.replyText(reply_token,`Please, fill some information before start use our service in this link: ${liffList.addUser}`)
    }
}

async function checkRegistedUser(userId) {
    let userData = await user.findOne({ userID: userId });
    if (userData !== null) {
        return true
    } else {
        return false
    }
}

function addNewUser(message) {
    let { userID } = message.source.userId
    let { reply_token } = message.reply_token
    user.findOne({ userID: userID }, (err, data) => {
        if (data == null) {
            messageFunction.replyText(reply_token,`welcome to LINE Education. Please, fill some information before start use our service in this link: ${liffList.addUser}`)
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
    mainServerHandle,addNewUser,joinGroup,leaveGroup,mainServerHandlePostBack
};