//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()


async function manageOffer(sourcePublicKey, sourceSecretKey, selling, buying, amount, price, offerId, source){
    
    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)

    let result
    
    await server.loadAccount(sourcePublicKey).then(async function(account){

        let options = {

            selling : selling,
            buying : buying,
            amount : amount,
            price : price,
            offerId : offerId,
            source :source,

        }

        let xdr_operation = StellarSdk.Operation.manageOffer(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)

        transaction = transaction.build()
        transaction.sign(sourceSecretKey)

        var xdr_base64 = transaction.toEnvelope().toXDR('base64')
        // console.log("\n[manageOffer] XDR base64: " + xdr_base64 + "\n")

        result = await server.submitTransaction(transaction)
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

    return result
}

module.exports.manageOffer = async function(sourcePublicKey, sourceSecretKey, selling, buying, amount, price, offerId, source){
    return await manageOffer(sourcePublicKey, sourceSecretKey, selling, buying, amount, price, offerId, source)
}



async function start(secret_key){

    const iceCoin = new StellarSdk.Asset('icecoins', config.issuer.public_key)

    // let sourceKeypair = StellarSdk.Keypair.fromSecret(config.user1.secret_key)
    let sourceKeypair = StellarSdk.Keypair.fromSecret(secret_key)
    let sourcePublic = sourceKeypair.publicKey()
    let sourceSecret = secret_key

    // let selling = iceCoin
    // let buying = StellarSdk.Asset.native()
    let selling = StellarSdk.Asset.native()
    let buying = iceCoin
    let amount = '0'

    let price =  { n : 2 , d : 1 }

    let offerId = 0 // find from xdr_result
    let source = sourcePublic

    await manageOffer(sourcePublic, sourceSecret, selling, buying, amount, price, offerId, source)
}
// start('SBDRAICFNAR2I4TYSFDYHW563RKWO7BQSLE55EE7S6TKJHJW3Q2VL4EL')