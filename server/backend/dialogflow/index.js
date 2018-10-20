const createClassIntent = require('./createClassIntent.js');
const listClassIntent = require('./listClassIntent.js');
const listCommandIntent = require('./listCommandIntent.js');

const projectId = 'lineeducation-949ee'; //https://dialogflow.com/docs/agents#settings
const sessionId = 'dialogflow-lodqfr@lineeducation-949ee.iam.gserviceaccount.com';
const languageCode = 'en-US';
const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient({
    keyFilename: './lineeducation-949ee-4323881c6fda.json'
});
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

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

module.exports = {
    passToDialogFlow
}