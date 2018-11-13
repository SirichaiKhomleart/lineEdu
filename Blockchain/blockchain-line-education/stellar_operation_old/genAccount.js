//import config file
let config = require('./config')

//import module for stellar test lab
let StellarSdk = require('stellar-sdk')
let server = new StellarSdk.Server(config.server)
StellarSdk.Network.useTestNetwork()

let request = require('request')


let pair = StellarSdk.Keypair.random()
let secret_key = pair.secret()
let public_key = pair.publicKey()

console.log("[gen_account] Create Account!")
console.log("[gen_account] Public Key: " + public_key)
console.log("[gen_account] Secret Key: " + secret_key)


let data = {

    url : 'https://friendbot.stellar.org',
    qs : { 
        addr : public_key,
    },
    json : true,

}

function check_response(error, response, body){

    if (error || response.statusCode !== 200) 

        console.error('ERROR!', error || body)
      
    else{

        console.log('[gen_account] SUCCESS! You have a new account :)')
        console.log("[gen_account] Hash: " + body['hash']+"\n")

        console.log('[show_info] Balances for account: ' + public_key)
        
        server.loadAccount(public_key).then(function(account){
            account.balances.forEach(function(balance) {
                console.log('[show_info] Type: ' + balance.asset_type + ', Balance: ' + balance.balance + "\n")
            })
        })

    }
    
}

request.get(data, function(error, response, body){ check_response(error, response, body) })

