const request = require('request')

const projectId = 'lineeducation-949ee'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'dialogflow-lodqfr@lineeducation-949ee.iam.gserviceaccount.com';
const languageCode = 'en-US';
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './lineeducation-949ee-4323881c6fda.json'
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);
const header = {
    "Authorization": "Bearer 11f7d61e86cb464ab5b8a7db15c68dc5",
    'Content-Type' : 'application/json'
}
const entityList = require('../constant/entity');

async function passToDialogFlow(msg,callback) {
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

async function updateEntity(entityName,data,callback) {
    console.log("url",`https://api.dialogflow.com/v1/entities/${entityList[entityName]}`);
    console.log("name",entityName);
    console.log("data",data);

    const requestDetail = {
        url: `https://api.dialogflow.com/v1/entities/${entityList[entityName]}`,
        headers: header,
        body: [data],
        json: true
    };
    await request.put(requestDetail, (err, res, body) => {
        console.log('err :' + err)
        console.log('res :'+ res)
    })
}

module.exports = {
    passToDialogFlow,updateEntity
}