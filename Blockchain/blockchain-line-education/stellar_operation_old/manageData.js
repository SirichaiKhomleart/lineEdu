//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()

async function manageData(sourcePublicKey, sourceSecretKey, name, value, source) {
    
    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)

    await server.loadAccount(sourcePublicKey).then(async function(account){

        let options = {

            name : name,
            value : value,
            source : source,

        }

        let xdr_operation = StellarSdk.Operation.manageData(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)

        transaction = transaction.build()
        transaction.sign(sourceSecretKey)

        var xdr_base64 = transaction.toEnvelope().toXDR('base64')
        // console.log("\n[manageOffer] XDR base64: " + xdr_base64 + "\n")

        await server.submitTransaction(transaction)
            .then(function(transactionResult) {
                // console.log(JSON.stringify(transactionResult, null, 3) + '\n')
                // console.log('[manageOffer] Success! View the manageOffer at: ')
                // console.log(transactionResult._links.transaction.href)
            })
            .catch(function(err) {
                console.log('[manageOffer] ERROR: An error has occured!')
                // console.log(err)
                //console.log(err.data.extras.result_codes)
                console.log("<--------------------[Stellar error information]-------------------->")
                console.log(err)
                console.log("ERROR CASE: "+err.response.data.title)
                console.log("STATUS: "+err.response.data.status)
                console.log("RESULT CODE: ")
                console.log(err.response.data.extras.result_codes)
                
                console.log("<--------------------[end error information]-------------------->")
                
            })

    })
    .catch(function(e) {
        console.error(e)
    })

}

module.exports.manageData = async function(sourcePublicKey, sourceSecretKey, name, value, source){
    await manageData(sourcePublicKey, sourceSecretKey, name, value, source)
}

async function manageData_test(secret_key){

    let sourceKeypair = StellarSdk.Keypair.fromSecret(secret_key)
    let sourcePublic = sourceKeypair.publicKey()
    let sourceSecret = secret_key

    let name = "manageData Test!!"
    let value = "Data value test!!!"
    let source = null

    console.log('Start manageData!')
    console.log('PublicKey: ' + sourcePublic)
    await manageData(sourcePublic, sourceSecret, name, value, source)
    console.log("manageData complete!")

}
// manageData_test(config.user1.secret_key)