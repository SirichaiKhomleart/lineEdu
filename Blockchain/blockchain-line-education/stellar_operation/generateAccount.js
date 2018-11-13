const StellarSdk = require('stellar-sdk')
const config = require('../stellar_operation/config')
const bigInt = require('big-integer')
let request_promise = require('request-promise')

// Use test network
if (config.network == "test") {
    StellarSdk.Network.useTestNetwork() 
}

async function register() {

    console.log('<--------------------[Register Function Start]-------------------->')
    
    //Generate Keypair
    let pair = StellarSdk.Keypair.random()
    let publicKey = pair.publicKey()
    let secretKey = pair.secret()
    console.log('[Register Function] INFO: Public Key is ' + publicKey + ' , Secret Key is ' + secretKey)

    //Funding with friendbot
    console.log('[Register Function] INFO: Funding XLM with Friendbot')
    try {
        let data = {
            url : 'https://friendbot.stellar.org',
            qs : { 
                addr : pair.publicKey(),
            },
            json : true,
        }
        // console.log('[Enroll Function] INFO: Funding Data Public Key is ' + data.qs.addr)
        await request_promise.get(data, function(error, response, body){
            console.log('[Register Function] INFO: Hash is ' + body['hash'])
        })
        console.log('[Register Function] SUCCESS: Finish create new account with funding.')
        console.log('<--------------------[User Register Function Endded]-------------------->')
        return pair

    } catch (err) {
        console.log('[Register Function] ERROR: Error occurred during funding with friendbot.')
        console.log('<--------------------[Register Function - Error Information]-------------------->')
        console.log('[Register Function] ERROR CASE: '+err.response.body.title)
        console.log('[Register Function] ERROR STATUS: '+err.response.body.status)
        console.log('[Register Function] ERROR RESULT CODE: ')
        console.log(err.response.body.extras.result_codes)
        console.log('<--------------------[End Error Information]-------------------->')
        throw (err)
    }
}

module.exports.register = async function(){
    return await register()
}