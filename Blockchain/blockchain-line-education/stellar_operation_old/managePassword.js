//import config file
let config = require('../config')

const Coupon = require('../models/coupon')
//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.stellar.server)
StellarSdk.Network.useTestNetwork()
const sha256 = require('sha256')

//import module stellar_op
let module_createAccount = require('../steller_operation/createAccount')
let module_preAuthTxHash = require('../steller_operation/preAuthTx')
let module_changeTrust = require('../steller_operation/changeTrust')
let module_payment = require('../steller_operation/payment')

async function changePasswd(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd, new_passwd) {

    // let sourceKeyPair = StellarSdk.Keypair.fromSecret(ownerSecretKey)
    let ownerChannalKeyPair = StellarSdk.Keypair.fromSecret(ownerChannalSecret)
    let changepassTx, options, xdr_operation
    console.log('<---------- create channal for change password ---------->')
    let channal = await module_createAccount.createAccount(ownerPublicKey, ownerSecretKey, '30', null)
    //let channal = await module_createAccount.createAccount(config.issuer.issuing.public, config.issuer.issuing.secret, '3.5', null)
    let channalKeyPair = StellarSdk.Keypair.fromSecret(channal.secret_key)
    console.log('Complete createAccount')
    console.log(channal)
    await server.loadAccount(channal.public_key).then(async function(account){
    try{
        changepassTx = new StellarSdk.TransactionBuilder(account)
        
        options = {
            signer : {
                sha256Hash : sha256(new_passwd),
                weight : 1,
            },
            lowThreshold: 2,
            medThreshold: 2,
            highThreshold: 2,
            source: ownerChannalPublic
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
            source: ownerChannalPublic
        }
        xdr_operation = StellarSdk.Operation.setOptions(options)
        changepassTx = changepassTx.addOperation(xdr_operation)

        changepassTx = changepassTx.build()
        changepassTx.sign(ownerChannalKeyPair)
        changepassTx.sign(channalKeyPair)
        changepassTx.signHashX(Buffer.from(old_passwd, 'utf8').toString('hex'))

        console.log('Before submit changepassTx')
        
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

async function setPasswd(id, ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, new_passwd) {

    try {
        console.log("owner is "+ownerPublicKey)
        // let sourceKeyPair = StellarSdk.Keypair.fromSecret(ownerSecretKey)
        let configKeypair = StellarSdk.Keypair.fromSecret(config.issuer.issuing.secret)
        let ownerChannalKeyPair = StellarSdk.Keypair.fromSecret(ownerChannalSecret)
        let setpassTX, options, xdr_operation
        console.log('<---------- create channal for set password ---------->')
        let channal = await module_createAccount.createAccount(ownerPublicKey, ownerSecretKey, '30', null)
        //let channal = await module_createAccount.createAccount(config.issuer.issuing.public, config.issuer.issuing.secret, '10', null)
        //console.log(channal)        
        let channalKeyPair = StellarSdk.Keypair.fromSecret(channal.secret_key)
        console.log('[setPassword] Complete createAccount')
        console.log(channal)
        await server.loadAccount(channal.public_key).then(async function(account){
            

            setpassTX = new StellarSdk.TransactionBuilder(account)

            console.log(ownerChannalPublic)
            console.log(new_passwd)
            console.log(sha256(new_passwd))

            console.log('------------------------------------------')
            
            options = {
                signer : {
                    sha256Hash : sha256(new_passwd),
                    weight : 1,
                },
                lowThreshold: 2,
                medThreshold: 2,
                highThreshold: 2,
                source: ownerChannalPublic
            }
            xdr_operation = StellarSdk.Operation.setOptions(options)
            setpassTX = setpassTX.addOperation(xdr_operation)
            setpassTX = setpassTX.build()
            setpassTX.sign(ownerChannalKeyPair)
            setpassTX.sign(channalKeyPair)
            setpassTX.sign(configKeypair)

            console.log('[setPassword] before submit')
                try{
                    console.log(setpassTX.operations)
                    console.log(setpassTX.signatures)
                    await server.submitTransaction(setpassTX)
                    await Coupon.updateOne({ _id: id}, {sign : true })

                }
                catch(err){
                    console.log(err.response.data.extras)
                }
            console.log('[setPassword] Complete setPassword')
            
        })
    

    } 
    catch (err) {
        console.log('ERR: ' + err)
    }

}

async function removePasswd(id,ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd) {

    let ownerChannalKeyPair = await StellarSdk.Keypair.fromSecret(ownerChannalSecret)
    let removepassTx, options, xdr_operation
    console.log('<---------- create channal for remove password ---------->')
    let channal = await module_createAccount.createAccount(ownerPublicKey, ownerSecretKey, '30', null)
    let channalKeyPair = await StellarSdk.Keypair.fromSecret(channal.secret_key)
    console.log('[removePassword] Complete createAccount')
    console.log(channal)
    await server.loadAccount(channal.public_key).then(async function(account){

        removepassTx = new StellarSdk.TransactionBuilder(account)

        options = {
            signer : {
                sha256Hash : sha256(old_passwd),
                weight : 0,
            },
            lowThreshold: 2,
            medThreshold: 2,
            highThreshold: 2,
            source: ownerChannalPublic
        }
        xdr_operation = StellarSdk.Operation.setOptions(options)
        removepassTx = removepassTx.addOperation(xdr_operation)

        removepassTx = removepassTx.build()
        console.log('set password after build')
        removepassTx.sign(ownerChannalKeyPair)
        removepassTx.sign(channalKeyPair)
        removepassTx.signHashX(Buffer.from(old_passwd, 'utf8').toString('hex'))
        console.log('set password after sign')

    console.log('[removePassword] before submit')
        try{
            console.log(removepassTx.operations)
            console.log(removepassTx.signatures)
            await server.submitTransaction(removepassTx)
            //// Remove sign flat
            let owner = await Coupon.updateOne({ _id: id}, {sign : false })
        }
        catch(err){
            console.log(err)
            console.log(err.response.data.extras)

        }
        
        console.log('[removePassword] complete submit removepassTx')
        

    })


}

module.exports.changePasswd = async function(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd, new_passwd){
    return await changePasswd(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd, new_passwd)
}
module.exports.setPasswd = async function(id,ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, new_passwd){
    return await setPasswd(id,ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, new_passwd)
}
module.exports.removePasswd = async function(id,ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd){
    return await removePasswd(id,ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd)
}
async function test_Passwd(){

    // const iceCoin = new StellarSdk.Asset('icecoins', config.issuer.public_key)
    // let ownerPublicKey = config.user1.public_key
    // let ownerSecretKey = config.user1.secret_key
    // let destination = config.user2.public_key
    

    // let escrow = await module_createAccount.createAccount(ownerPublicKey, ownerSecretKey, '20', null)
    // await module_changeTrust.changeTrust(escrow.public_key, escrow.secret_key, iceCoin, null, null)
    // await module_payment.payment(config.issuer.public_key, config.issuer.secret_key, escrow.public_key, iceCoin, '30')
    // let channal = await module_createAccount.createAccount(escrow.public_key, escrow.secret_key, '10', null)

    // console.log('Before preAuthTxHash')
    // let result =  await module_preAuthTxHash.preAuthTxHash(escrow.public_key, escrow.secret_key, destination, channal.secret_key, iceCoin, '1', 1, '123')
    // let tx = new StellarSdk.Transaction(result.toEnvelope().toXDR('base64'))
    // console.log('preAuthTxHash')

    let ownerPublicKey = 'GC23I3SDSOIDJAZSSSXJU3KLYGKRJ2LL2GWJDWZGHYFT3EPMOYUG5MX5'
    let ownerSecretKey = 'SDNG6H432Y4JAKYBMCSS3DFNNIHIXPTEWL3VMOZ6U77PXHW5WKXDGR4W'
    let ownerChannalPublic = 'GAQKTJGDZ4DITRUF5327KTPXIZGPH5RJVAIN5WMALH4CIX2QT4ONTG7E'
    let ownerChannalSecret = 'SA3KDKR33UMJAUESCAHVDCTRHJ2IOSKZX7LO2XOE3HPDSS2UQMSVQVVU'
    let old_passwd = '123'
    let new_passwd = '456'


    // console.log('[testSetPassword] begin setPasswd')  
    // await setPasswd(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd)
    // console.log('[testSetPassword] setPasswd complete')

    // console.log('[testChangePassword] begin changePasswd')
    // await changePasswd(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, old_passwd,new_passwd)
    // console.log('[testChangePassword] changePasswd complete')

    // console.log('[testRemovePassword] begin removePasswd')
    // await removePasswd(ownerPublicKey, ownerSecretKey, ownerChannalPublic, ownerChannalSecret, new_passwd)
    // console.log('[testRemovePassword] removePasswd complete')
        
    // tx.signHashX(Buffer.from('123', 'utf8').toString('hex'))
    // await server.submitTransaction(tx)
    // console.log('Complete submit for claim')
    
}
// test_Passwd()