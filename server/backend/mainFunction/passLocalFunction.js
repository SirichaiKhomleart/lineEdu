const request = require('request') 
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer svGsqRZqRcnxR0tOJZXWqZxiioJXQGv7btlA4iyuAT5KWbqTg+9y6N5i1J6ir/x2u+9xMXGUhG31BPel4QW48aSkwiclb45M/rTSnejiAGmiQN0j+ZwcJYBH/IKvBLM/maV/yWBuh1eThXdOwVt4iFGUYhWQfeY8sLGRXgo3xvw='
}

var makLocalhost = ""
var nutLocalhost = ""
var poomLocalhost = ""

function setLocalhost(source,url){
    switch (source) {
        case "mak":
            makLocalhost = url
            console.log(makLocalhost + " is recorded.")
            break;
        case "nut":
            nutLocalhost = url
            console.log(nutLocalhost + " is recorded.")
            break;
        case "poom":
            poomLocalhost = url
            console.log(poomLocalhost + " is recorded.")
            break;
        default:
            console.log("not match");
    }
}

async function passToMak(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: `${makLocalhost}/webhook`,
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('mak localhost:')
        if (body != '404') {
            isLocalhostTurnOn = true
        }
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
    })
    return isLocalhostTurnOn
}

async function passToPoom(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: `${poomLocalhost}/webhook`,
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('poom localhost:')
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
        if (body != '404') {
            isLocalhostTurnOn = true
        }
    })
    return isLocalhostTurnOn
}

async function passToNut(passBody){
    passBody = {...passBody, passing: true}
    let isLocalhostTurnOn = false
    await request.post({
		url: `${nutLocalhost}/webhook`,
		headers: {
            'Content-Type': 'application/json'
        },
        json: true,
		body: passBody
	}, (err, res, body) => {
        console.log('nut localhost:')
        console.log('err :' + err)
        console.log('res :'+res)
        console.log('body :'+body)
        if (body != '404') {
            isLocalhostTurnOn = true
        }
    })
    return isLocalhostTurnOn
}

module.exports = {
    passToMak,passToNut,passToPoom,setLocalhost
};