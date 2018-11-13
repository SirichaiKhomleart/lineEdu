//import config file
let test_config = require('./config')
let config = require('../config')
const sha256 = require('sha256')
// import atob from 'atob'
//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.stellar.server)
StellarSdk.Network.useTestNetwork()
//import module operation
let module_createAccount = require('../steller_operation/createAccount')
let module_changeTrust = require('../steller_operation/changeTrust')
let module_payment = require('../steller_operation/payment')
let module_accountMerge = require('../steller_operation/accountMerge')

async function preAuthTx(sourcePublicKey, sourceSecretKey, destination, asset, amount, weight){
    sourceSecretKey = StellarSdk.Keypair.fromSecret(sourceSecretKey)
    let presignTx
    
    await server.loadAccount(sourcePublicKey).then(async function(account){
        account.incrementSequenceNumber()
        presignTx = new StellarSdk.TransactionBuilder(account)
        
        let options = {
            destination : destination,
            asset : asset,
            amount : amount,
        }
        let xdr_operation = StellarSdk.Operation.payment(options)
        presignTx = presignTx.addOperation(xdr_operation)
        presignTx = presignTx.build()
    })
    .catch(function(e) {
        console.error(e)
    })
    await server.loadAccount(sourcePublicKey).then(async function(account){
        let options = {
            signer : {
                preAuthTx : presignTx.hash(),
                weight : weight,
            }
        }
        let xdr_operation = StellarSdk.Operation.setOptions(options)
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
            })
    })
    .catch(function(e) {
        console.error(e)
    })
    return presignTx
}
async function preAuthTxChannal(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight){
    let sourceKeyPair = StellarSdk.Keypair.fromSecret(sourceSecretKey)
    let channalKeyPair = StellarSdk.Keypair.fromSecret(channalSecretKey)
    let channalPublicKey = channalKeyPair.publicKey()
    console.log('EscrowPublic : ' + sourcePublicKey)
    console.log('ChannalPublic : ' + channalPublicKey)
    let presignTx
    
    await server.loadAccount(channalPublicKey).then(async function(account){
        account.incrementSequenceNumber()
        let options = {
            destination : destinationPublicKey,
            asset : asset,
            amount : amount,
            source: sourcePublicKey,
        }
        let xdr_operation = StellarSdk.Operation.payment(options)
        presignTx = new StellarSdk.TransactionBuilder(account)
        presignTx = presignTx.addOperation(xdr_operation)
        presignTx = presignTx.build()
        presignTx.sign(sourceKeyPair)
    })
    .catch(function(e) {
        console.error(e)
    })
    
    await server.loadAccount(channalPublicKey).then(async function(account){
        let options = {
            signer : {
                preAuthTx : presignTx.hash(),
                weight : weight,
            }
        }
        let xdr_operation = StellarSdk.Operation.setOptions(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)
        transaction = transaction.build()
        transaction.sign(channalKeyPair)
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
    return presignTx
}
async function preAuthTxMemo(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight){
    let sourceKeyPair = StellarSdk.Keypair.fromSecret(sourceSecretKey)
    let channalKeyPair = StellarSdk.Keypair.fromSecret(channalSecretKey)
    let channalPublicKey = channalKeyPair.publicKey()
    let presignTx
    
    await server.loadAccount(channalPublicKey).then(async function(account){
        account.incrementSequenceNumber()
        presignTx = new StellarSdk.TransactionBuilder(account)
        let options = {
            destination : destinationPublicKey,
            asset : asset,
            amount : amount,
            source: sourcePublicKey,
        }
        let xdr_operation = StellarSdk.Operation.payment(options)
        presignTx = presignTx.addOperation(xdr_operation)
        presignTx = presignTx.addMemo(StellarSdk.Memo.hash(sha256('123')))
        presignTx = presignTx.build()
        presignTx.sign(sourceKeyPair)
    })
    .catch(function(e) {
        console.error(e)
    })
    await server.loadAccount(channalPublicKey).then(async function(account){
        let options = {
            signer : {
                preAuthTx : presignTx.hash(),
                weight : weight,
            },
        }
        let xdr_operation = StellarSdk.Operation.setOptions(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)
        transaction = transaction.build()
        transaction.sign(channalKeyPair)
        let xdr_base64 = transaction.toEnvelope().toXDR('base64')
        console.log("[payment] XDR base64: " + xdr_base64 + "\n")
        await server.submitTransaction(transaction)
            .then(function(transactionResult) {
                console.log(JSON.stringify(transactionResult, null, 3) + '\n')
            })
            .catch(function(err) {
                console.log('An error has occured:')
                console.log(err)
            })
    })
    .catch(function(e) {
        console.error(e)
    })
    return presignTx
}
async function preAuthTxHash(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight){
    
    let sourceKeyPair = StellarSdk.Keypair.fromSecret(sourceSecretKey)
    let channalKeyPair = StellarSdk.Keypair.fromSecret(channalSecretKey)
    let kserveKeypair = StellarSdk.Keypair.fromSecret(config.issuer.issuing.secret)
    let channalPublicKey = channalKeyPair.publicKey()
    let presignTx, options, xdr_operation
    
    await server.loadAccount(channalPublicKey).then(async function(account){
        //set signer: issuer of kserver
        let hashTx = new StellarSdk.TransactionBuilder(account)
        options = {
            signer : {
                ed25519PublicKey : config.issuer.issuing.public,
                weight : weight,
            },
            // masterWeight: weight,
            lowThreshold: 2,
            medThreshold: 2,
            highThreshold: 2,
        }
        xdr_operation = StellarSdk.Operation.setOptions(options)
        hashTx = hashTx.addOperation(xdr_operation)
        hashTx = hashTx.build()
        hashTx.sign(channalKeyPair)
        await server.submitTransaction(hashTx)
    })
    
    await server.loadAccount(channalPublicKey).then(async function(account){
        account.incrementSequenceNumber()
        presignTx = new StellarSdk.TransactionBuilder(account)
        options = {
            destination : destinationPublicKey,
            asset : asset,
            amount : amount,
            source: sourcePublicKey,
        }
        xdr_operation = StellarSdk.Operation.payment(options)
        presignTx = presignTx.addOperation(xdr_operation)
        presignTx = presignTx.build()
        presignTx.sign(sourceKeyPair)
        
    })
    .catch(function(e) {
        console.error(e)
    })
    await server.loadAccount(channalPublicKey).then(async function(account){
        let options = {
            signer : {
                preAuthTx : presignTx.hash(),
                weight : weight,
            },
        }
        let xdr_operation = StellarSdk.Operation.setOptions(options)
        let transaction = new StellarSdk.TransactionBuilder(account)
        transaction = transaction.addOperation(xdr_operation)
        transaction = transaction.build()
        transaction.sign(channalKeyPair)
        transaction.sign(kserveKeypair)
        let xdr_base64 = transaction.toEnvelope().toXDR('base64')
        await server.submitTransaction(transaction)
            .then(function(transactionResult) {
                console.log(JSON.stringify(transactionResult, null, 3) + '\n')
            })
            .catch(function(err) {
                console.log('An error has occured:')
                // console.log(err)
                console.log(err.response.data.extras.result_codes)
            })
    })
    .catch(function(e) {
        console.error(e)
    })
    return presignTx
}
module.exports.preAuthTx = async function(sourcePublicKey, sourceSecretKey, destination, asset, amount, weight){
    return await preAuthTx(sourcePublicKey, sourceSecretKey, destination, asset, amount, weight)
}
module.exports.preAuthTxChannal = async function(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight){
    return await preAuthTxChannal(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight)
}
module.exports.preAuthTxHash = async function(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight, passwd){
    return await preAuthTxHash(sourcePublicKey, sourceSecretKey, destinationPublicKey, channalSecretKey, asset, amount, weight, passwd)
}
async function test_preAuthTxChannal(){
    const iceCoin = new StellarSdk.Asset('icecoins', test_config.issuer.public_key)
    let sourcePublicKey = test_config.user1.public_key
    let sourceSecretKey = test_config.user1.secret_key
    let destination = test_config.user2.public_key
    try{
        let escrow = await module_createAccount.createAccount(sourcePublicKey, sourceSecretKey, '100', null)
        await module_changeTrust.changeTrust(escrow.public_key, escrow.secret_key, iceCoin, null, null)
        await module_payment.payment(test_config.issuer.public_key, test_config.issuer.secret_key, escrow.public_key, iceCoin, '30')
        let channal1 = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '5', null)
        let presignTx1 = await preAuthTxChannal(escrow.public_key, escrow.secret_key, destination, channal1.secret_key, iceCoin, '10', 1)
        let tx1 = new StellarSdk.Transaction(presignTx1.toEnvelope().toXDR('base64'))
        console.log('complete channal 1: ' + tx1 + '\n')
        
        let channal2 = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '5', null)
        let presignTx2 = await preAuthTxChannal(escrow.public_key, escrow.secret_key, destination, channal2.secret_key, iceCoin, '10', 1)
        let tx2 = new StellarSdk.Transaction(presignTx2.toEnvelope().toXDR('base64'))
        console.log('complete channal 2: ' + tx2 + '\n')
        
        
        let channal3 = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '5', null)
        let presignTx3 = await preAuthTxChannal(escrow.public_key, escrow.secret_key, destination, channal3.secret_key, iceCoin, '10', 1)
        let tx3 = new StellarSdk.Transaction(presignTx3.toEnvelope().toXDR('base64'))
        console.log('complete channal 3: ' + tx3 + '\n')
        
        
        let result = await server.submitTransaction(tx1)
        console.log('complete channal 1!')
        console.log(result + '\n')
        await module_accountMerge.accountMerge(channal1.public_key, channal1.secret_key, escrow.public_key, null)
        result = await server.submitTransaction(tx2)
        console.log('complete channal 2!')
        console.log(result + '\n')
        await module_accountMerge.accountMerge(channal2.public_key, channal2.secret_key, escrow.public_key, null)
        result = await server.submitTransaction(tx3)
        console.log('complete channal 3!')
        console.log(result + '\n')
        await module_accountMerge.accountMerge(channal3.public_key, channal3.secret_key, escrow.public_key, null)
    
    }
    catch(err){
        console.log(err)
        console.log(err.response.data.extras.result_codes)
    }
}
// test_preAuthTxChannal()
async function test_preAuthTxMemo(){
    const iceCoin = new StellarSdk.Asset('icecoins', test_config.issuer.public_key)
    let sourcePublicKey = test_config.user1.public_key
    let sourceSecretKey = test_config.user1.secret_key
    let destination = test_config.user2.public_key
    try{
        let escrow = await module_createAccount.createAccount(sourcePublicKey, sourceSecretKey, '100', null)
        await module_changeTrust.changeTrust(escrow.public_key, escrow.secret_key, iceCoin, null, null)
        await module_payment.payment(test_config.issuer.public_key, test_config.issuer.secret_key, escrow.public_key, iceCoin, '30')
        let channal1 = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '5', null)
        let presignTx1 = await preAuthTxHash(escrow.public_key, escrow.secret_key, destination, channal1.secret_key, iceCoin, '10', 1)
        let tx1 = new StellarSdk.Transaction(presignTx1.toEnvelope().toXDR('base64'))
        console.log('complete channal 1:\n')
        console.log('Memo: ' + tx1.tx._attributes.memo._value.toString('hex'))
        console.log('Sha256 123: ' + sha256('123'))
        console.log((sha256('123')) == tx1.tx._attributes.memo._value.toString('hex'))
        if((sha256('123')) == tx1.tx._attributes.memo._value.toString('hex')){
            let result = await server.submitTransaction(tx1)
            console.log('submit channal 1 complete!')
            console.log(result)
        }
    }
    catch(err){
        console.log(err)
        console.log(err.response.data.extras.result_codes)
    }
}
// test_preAuthTxMemo()
async function test_preAuthTxHash(){
    const iceCoin = new StellarSdk.Asset('icecoins', test_config.issuer.public_key)
    let sourcePublicKey = test_config.user1.public_key
    let sourceSecretKey = test_config.user1.secret_key
    let destination = test_config.user2.public_key
    try{
        let escrow = await module_createAccount.createAccount(sourcePublicKey, sourceSecretKey, '100', null)
        await module_changeTrust.changeTrust(escrow.public_key, escrow.secret_key, iceCoin, null, null)
        await module_payment.payment(test_config.issuer.public_key, test_config.issuer.secret_key, escrow.public_key, iceCoin, '30')
        let channal1 = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '5', null)
        let presignTx1 = await preAuthTxHash(escrow.public_key, escrow.secret_key, destination, channal1.secret_key, iceCoin, '10', 1, '123')
        let tx1 = new StellarSdk.Transaction(presignTx1.toEnvelope().toXDR('base64'))
        console.log('complete channal 1: ' + tx1 + '\n')
        
        tx1.signHashX(Buffer.from('123', 'utf8').toString('hex'))
        let result = await server.submitTransaction(tx1)
        console.log('complete channal 1!')
        console.log(result + '\n')
       
    }
    catch(err){
        console.log(err)
        console.log(err.response.data.extras.result_codes)
    }
}
// test_preAuthTxHash()
// let passwd = Buffer.from('123', 'utf8')
// console.log(passwd.toString('hex'))