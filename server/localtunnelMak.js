const localtunnel = require('localtunnel')

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
      console.log('Running', tl.url)
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