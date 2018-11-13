const StellarSdk = require('stellar-sdk')
const config = require('../stellar_operation/config')
const bigInt = require('big-integer')
let request_promise = require('request-promise')
let module_generateAccount = require('../stellar_operation/generateAccount')
let module_changeTrust = require('../stellar_operation/changeTrust')

// Stellar Horizon server
const server = new StellarSdk.Server(config.server)

// Use test network
if (config.network == "test") {
    StellarSdk.Network.useTestNetwork() 
}

const sequenceUp = function(seq, inc) {
    return bigInt(seq).add(inc).toString()
}

// Token in system
const LineEds = new StellarSdk.Asset('LineEds', config.core_account.public_key)


async function studentRegister() {

    console.log('<--------------------[Student Register Function Start]-------------------->')
    ukeypair = await module_generateAccount.register()
    let result = {
        student_public_key : ukeypair.publicKey(),
        student_secret_key : ukeypair.secret(),
    }
    console.log(result)
    console.log('<--------------------[Student Register Function Done]-------------------->')
    return result
    
}    

async function teacherRegister() {

    console.log('<--------------------[Teacher Register Function Start]-------------------->')
    ukeypair = await module_generateAccount.register()
    let result = {
        teacher_public_key : ukeypair.publicKey(),
        teacher_secret_key : ukeypair.secret(),
    }
    console.log(result)
    console.log('<--------------------[Teacher Register Function Done]-------------------->')
    return result
    
}   

async function classRegister() {

    console.log('<--------------------[Class Register Function Start]-------------------->')
    issuerKeypair = await module_generateAccount.register()
    distributedKeypair = await module_generateAccount.register() 
    let result = {
        issuer_public_key : issuerKeypair.publicKey(),
        issuer_secret_key : issuerKeypair.secret(),
        distributed_public_key : distributedKeypair.publicKey(),
        distributed_secret_key : distributedKeypair.secret(),
    }
    console.log(result)
    console.log('<--------------------[Class Register Function Done]-------------------->')
    return result
    
}   

async function createClass(userKey,classKey) {

    console.log('<--------------------[Create Class Function Start]-------------------->')
    //core_account trust LineEds of new class
    await module_changeTrust.changeTrust(userKey,"LineEds",classKey)
    console.log('<--------------------[Create Class Function Done]-------------------->')
    // return result
    
}    

module.exports.studentRegister = async function(){
    await studentRegister()
}
module.exports.teacherRegister = async function(){
    await teacherRegister()
}
module.exports.createClass = async function(){
    await createClass(userKey,classKey)
}
module.exports.classRegister = async function(){
    await classRegister()
}

async function test(){
    // studentKeyGen = await studentRegister()
    classKeyGen = await classRegister()
    createClass(config.core_account,classKeyGen)
}

test()