//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()


async function createAccount(sourcePublicKey, sourceSecretKey, startingBalance, source){

    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)

    let result = {
        public_key : null,
        secret_key : null,
    }
    let public_key, secret_key

    await server.loadAccount(sourcePublicKey).then(async function(account){

        // test gen new keypair
        let pair = StellarSdk.Keypair.random()
        public_key = pair.publicKey()
        secret_key = pair.secret()
        
    
        let options = {
            destination : public_key, //String
            startingBalance : startingBalance,
            // source : source // Optional
        }
    
        let xdr_oparation = StellarSdk.Operation.createAccount(options)
    
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction.addOperation(xdr_oparation)
    
        transaction = transaction.build()
        transaction.sign(sourceSecretKey)
        
        await server.submitTransaction(transaction).then(function(transactionResult) {
            
            result.public_key = public_key
            result.secret_key = secret_key
                // console.log(JSON.stringify(transactionResult, null, 3) + '\n')
                // console.log('[createAccount] Success! View the createAccount at: ')
                // console.log(transactionResult._links.transaction.href)
            })
            .catch(function(err) {
                console.log('An error has occured:')
                console.log(err)
                console.log(err.response.data.extras.result_codes)

            })

        })
        .catch(function(err){
            console.log('An error has occured:')
            console.log(err)
            console.log(err.response.data.extras.result_codes)
        })

    return result

}

module.exports.createAccount = async function(sourcePublicKey, sourceSecretKey, startingBalance, source){
    return await createAccount(sourcePublicKey, sourceSecretKey, startingBalance, source)
}


async function start(){

    let sourceKeypair = StellarSdk.Keypair.fromSecret(config.user1.secret_key)
    let sourcePublicKey = sourceKeypair.publicKey()
    let sourceSecretKey = config.user1.secret_key
    let startingBalance = '5'
    
    await createAccount(sourcePublicKey, sourceSecretKey, startingBalance, null)
    console.log(result)

}
// start()
