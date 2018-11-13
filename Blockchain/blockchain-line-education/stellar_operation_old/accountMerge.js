//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()

// import module
let module_createAccount = require('./createAccount')

async function accountMerge(sourcePublicKey, sourceSecretKey, destination, source){

    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)

    await server.loadAccount(sourcePublicKey).then(async function(account){
        
        let options = { 

            destination : destination,
            source : source,

        }

        let xdr_operation = StellarSdk.Operation.accountMerge(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)

        transaction = transaction.build()
        transaction.sign(sourceSecretKey)


        let xdr_base64 = transaction.toEnvelope().toXDR('base64')

        await server.submitTransaction(transaction)
            .then(function(transactionResult) {

                // console.log(JSON.stringify(transactionResult, null, 3) + '\n')
                // console.log('[allowTrust] Success! View the allowTrust at: ')
                // console.log(transactionResult._links.transaction.href)

            })
            .catch(function(err) {

                console.log('An error has occured:')
                console.log(err + '\n')
                
            })

    })

    .catch(function(e) {
        console.error(e)
    })

}

module.exports.accountMerge = async function(sourcePublicKey, sourceSecretKey, destination, source){
    await accountMerge(sourcePublicKey, sourceSecretKey, destination, source)
}


async function start(public_key, secret_key){

    let sourcePublicKey = config.user1.public_key
    let sourceSecretKey = config.user1.secret_key
    let startingBalance = '100'

    // create new account
    // let account = await module_createAccount.createAccount(sourcePublicKey, sourceSecretKey, startingBalance, null)
    // public = account.public
    // secret = account.secret
    // console.log('\nCreate new account for merge.')
    // console.log('Public: ' + account.public)
    // console.log('Secret: ' + account.secret + '\n')


    console.log('\naccountMerge!!!')
    await accountMerge(public_key, secret_key, sourcePublicKey, null)

}
// start('GBDQT7R66QDEZPYNYNSRL4ZGGS7HRGGK4ALTTSSYMY2RULFRWOHEHRG2', 'SDAAJWO42J7E3LLZQFNJCRIHH6EFWQ33RJZK2LASVIB7IKIMG6ZVTBG7')