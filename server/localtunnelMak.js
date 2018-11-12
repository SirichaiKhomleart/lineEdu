const localtunnel = require('localtunnel')
const request = require('request') 

const tunels = [{
  subdomain: 'localhostmak3000',
  local_host: 'localhost',
  port: 3000,
}, {
  subdomain: 'localhostmak3001',
  local_host: 'localhost',
  port: 3001,
}]

const tlTunels = {}

const run = async (options, key) => {
  tlTunels[key] = localtunnel(options.port, options, (err, tl) => {
    if (err) {
      run(options, key)
    } else {
      console.log('Running port-'+options.port+" on url: "+tl.url)
      if (options.port == 3001) {
        setLocalhost(tl.url)
      }
    }
  })

  tlTunels[key].on('error', (e) => {
    console.log(e)
    run(options, key)
  })

  tlTunels[key].on('close', (e) => {
    console.log(e)
    run(options, key)
  })
}

tunels.forEach((options, key) => {
  run(options, key)
})

function setLocalhost(url){
  request.post({
  url: `http://35.220.199.11:3001/getConnect`,
    headers: {
            'Content-Type': 'application/json'
        },
        json: true,
    body: {
      source: "mak",
      localhost: url
    }
  }, (err, res, body) => {
        console.log('err :' + err)
        console.log('res :'+res)
    })
}