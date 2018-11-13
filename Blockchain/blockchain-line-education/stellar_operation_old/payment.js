//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()


async function payment(sourcePublicKey, sourceSecretKey, receiverPublicKey, asset, amount){

    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)

    await server.loadAccount(sourcePublicKey).then(async function(account) {

        let options = {

            destination : receiverPublicKey,
            asset : asset,
            amount : amount,
            source : null // optional

        }

        let xdr_operation = StellarSdk.Operation.payment(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)

        transaction = transaction.build()
        transaction.sign(sourceSecretKey)


        let xdr_base64 = transaction.toEnvelope().toXDR('base64')
        // console.log("[payment] XDR base64: " + xdr_base64 + "\n")

        await server.submitTransaction(transaction)
            .then(function(transactionResult) {
                // console.log(JSON.stringify(transactionResult, null, 3) + '\n')
                // console.log('[payment] Success! View the transaction at: ')
                // console.log(transactionResult._links.transaction.href)
            })
            .catch(function(err) {
                console.log('An error has occured:')
                console.log(err)
                console.log(err.response.data.extras.result_codes)
            })
    })

    .catch(function(e) {
        console.error(e)
    })

}

module.exports.payment = async function(sourcePublic, sourceSecret, receiverPublic, asset, amount){
    await payment(sourcePublic, sourceSecret, receiverPublic, asset, amount)
}

async function start(){
    let sourceKeypair = StellarSdk.Keypair.fromSecret(config.user1.secret_key)
    let sourcePublic = sourceKeypair.publicKey()

    let receiverPublic = config.user2.public_key
    let sourceSecret = config.user1.secret_key
    let asset = StellarSdk.Asset.native()
    let amount = '100'
    console.log("\n[payment] Public key: " + sourcePublic + "\n")
    await payment(sourcePublic, sourceSecret, receiverPublic, asset, amount)
}
// start()







