const StellarSdk = require('stellar-sdk')
const config = require('../stellar_operation/config')
const bigInt = require('big-integer')
let request_promise = require('request-promise')

// Use test network
if (config.network == "test") {
    StellarSdk.Network.useTestNetwork() 
}
let server = new StellarSdk.Server(config.server)

async function check(userKeypairPublicKey){
    check =  await server.loadAccount(userKeypairPublicKey)
    console.log(check)
}
async function changeTrust(userKeypair, assetName, classIssuerSource){

    console.log("Module Change Trust: Received signal")
    
    userKeypairPublicKey = userKeypair.public_key
    userKeypairSecretKey = userKeypair.secret_key
    userKeypair = StellarSdk.Keypair.fromSecret(userKeypairSecretKey)
    classIssuerSourcePublicKey = classIssuerSource.issuer_public_key
    classIssuerSourceSecretKey = classIssuerSource.issuer_secret_key
    classIssuerSourceKeypair = StellarSdk.Keypair.fromSecret(classIssuerSourceSecretKey)
    // console.log(userKeypairPublicKey)
    // console.log(userKeypairSecretKey)
    // console.log(userKeypair)
    // console.log(classIssuerSourcePublicKey)
    // console.log(classIssuerSourceSecretKey)
    console.log("Module Change Trust: Read users keypair")

    const assets = new StellarSdk.Asset(assetName, classIssuerSourcePublicKey)
    console.log("Module Change Trust: Create asset")

    await server.loadAccount(userKeypairPublicKey).then(async function(account){

        //Operation
        let options = {
            asset : assets,
        }
        let xdr_operation = StellarSdk.Operation.changeTrust(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)
        transaction = transaction.build()
        console.log("Module Change Trust: Create transaction")

        //Sign the transaction
        transaction.sign(userKeypair)
        console.log("Module Change Trust: Sign transaction")
        let xdr_base64 = transaction.toEnvelope().toXDR('base64')
        console.log("Module Change Trust: XDR base64 is " + xdr_base64 + "\n")

        //Submit transaction
        await server.submitTransaction(transaction)
            .then(function(transactionResult) {

                // console.log(JSON.stringify(transactionResult, null, 3) + '\n')
                // console.log('[changeTrust] Success! View the changeTrust at: ')
                // console.log(transactionResult._links.transaction.href + '\n')

            })
            .catch(function(err) {

                console.log('An error has occured:')
                // console.log(err)
                console.log("<--------------------[Stellar error information]-------------------->")
                // console.log(err)
                console.log("ERROR CASE: "+err.response.data.title)
                console.log("STATUS: "+err.response.data.status)
                console.log("RESULT CODE: ")
                console.log(err.response.data.extras.result_codes)
                // check(userKeypairPublicKey)
                console.log(err.response)
                console.log("<--------------------[end error information]-------------------->")
            })

    })

    .catch(function(e) {
        console.error(e)
    })

}


module.exports.changeTrust = async function(userKeypair, assetName, classIssuerSource){
    await changeTrust(userKeypair, assetName, classIssuerSource)
}
