//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()
const sha256 = require('sha256')

//import module stellar_op
let module_createAccount = require('../steller_operation/createAccount')
let module_preAuthTxHash = require('../steller_operation/preAuthTx')
let module_changeTrust = require('../steller_operation/changeTrust')
let module_payment = require('../steller_operation/payment')

async function changePasswd(sourcePublicKey, sourceSecretKey, sourceChannalPublic, sourceChannalSecret, old_passwd, new_passwd) {
    
    let sourceKeyPair = StellarSdk.Keypair.fromSecret(sourceSecretKey)
    let sourceChannalKeyPair = StellarSdk.Keypair.fromSecret(sourceChannalSecret)
    let changepassTx, options, xdr_operation
    console.log('----------< create channal for change password >----------')
    let channal = await module_createAccount.createAccount(sourcePublicKey, sourceSecretKey, '2.5', null)
    let channalKeyPair = StellarSdk.Keypair.fromSecret(channal.secret_key)
    console.log('Complete createAccount')

    await server.loadAccount(channal.public_key).then(async function(account){

        changepassTx = new StellarSdk.TransactionBuilder(account)
        
        options = {
            signer : {
                sha256Hash : sha256(new_passwd),
                weight : 1,
            },
            lowThreshold: 2,
            medThreshold: 2,
            highThreshold: 2,
            source: sourceChannalPublic
        }
        xdr_operation = StellarSdk.Operation.setOptions(options)
        changepassTx = changepassTx.addOperation(xdr_operation)

        options = {
            signer : {
                sha256Hash : sha256(old_passwd),
                weight : 0,
            },
            lowThreshold: 2,
            medThreshold: 2,
            highThreshold: 2,
            source: sourceChannalPublic
        }

        xdr_operation = StellarSdk.Operation.setOptions(options)
        changepassTx = changepassTx.addOperation(xdr_operation)
        changepassTx = changepassTx.build()
        changepassTx.sign(sourceChannalKeyPair)
        changepassTx.sign(channalKeyPair)
        changepassTx.signHashX(Buffer.from(old_passwd, 'utf8').toString('hex'))

        console.log('Before submit changepassTx')

        try{
            console.log(changepassTx.operations)
            console.log(changepassTx.signatures)
            await server.submitTransaction(changepassTx)
        }
        catch(err){
            console.log(err)
            console.log(err.response.data.extras)

        }
        
        console.log('complete submit changepassTx')
        

    })

}

async function test_changePasswd(){

    let escrowPublic = 'GCYHXXJVYVFCPE5RWKGSOUSCNC6DDHDMKZEFFGNXAU6XE3VX3N475OQP'
    let escrowSecret = 'SCBK24BCAULQK4FW2XT7OCI4KSOEGHYQQYWBJ7JZMHVNHTLLNSBQOQTQ'
    let channalPublic = 'GDFDHZHG3BHXE4NGAUZDUTZIQS7SWOLAHKGCORRT2S2XX253GTVF5IWA'
    let channalSecret = 'SCPLIIZM6GBWTRDVIKIHPGVP4LHJZYAQZKJFWDSEBLXLN4VS6NEO2LGM'
    await changePasswd(escrowPublic, escrowSecret, channalPublic, channalSecret, '123','tanakrit')
    console.log('changePasswd complete')
}
// test_changePasswd()