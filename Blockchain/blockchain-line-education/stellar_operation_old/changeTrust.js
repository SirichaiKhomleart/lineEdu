//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()

// import my modules
let module_payment = require('./payment')

async function changeTrust(distributePublic, distributeSecret, asset, limit, source){
    
    distributeSecret = StellarSdk.Keypair.fromSecret(distributeSecret)

    await server.loadAccount(distributePublic).then(async function(account){

        let options = {

            asset : asset,
            // limit : null,
            source : source,

        }

        let xdr_operation = StellarSdk.Operation.changeTrust(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)
        transaction = transaction.build()
        transaction.sign(distributeSecret)


        let xdr_base64 = transaction.toEnvelope().toXDR('base64')
        // console.log("[changeTrust] XDR base64: " + xdr_base64 + "\n")

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
                
                console.log("<--------------------[end error information]-------------------->")
            })

    })

    .catch(function(e) {
        console.error(e)
    })

}


module.exports.changeTrust = async function(distributePublic, distributeSecret, asset, limit, source){
    await changeTrust(distributePublic, distributeSecret, asset, limit, source)
}


async function start(){

    const iceCoin = new StellarSdk.Asset('icecoins', config.issuer.public_key)
    let sourceKeypair = StellarSdk.Keypair.fromSecret(config.user2.secret_key)
    let distributePublic = sourceKeypair.publicKey()
    let distributeSecret = config.user2.secret_key

    await changeTrust(distributePublic, distributeSecret, iceCoin, null, null)
    module_payment.payment(config.issuer.public_key, config.issuer.secret_key, config.user2.public_key, iceCoin, '10000')

}
// start()