const WebSocket = require('ws')
const handler = require('./handler')
const Session = require('models/Session')
const uuid = require('uuid')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
  ws.isAlive = true
  ws.on('pong', heartbeat)
  this.session = new Session({
      id: uuid.v4(),
      items: []
  })

  this.session.save()

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping(noop)
    })
  }, 30000)

  ws.on('message', function incoming(message) {
    console.log(`Received message "${message.trim()}"`)
    try {
      req = JSON.parse(message)
    } catch (e) {
      return console.log(e)
    }
    if (!req.action) {
      return console.log(`No action found in message`)
    }

    switch (req.action) {
      case "add":
        try {
          const newProduct = handler.add(req.payload, this)
          ws.send(JSON.stringify({
            action: 'added',
            payload: newProduct
          }))
        }
        catch (e) {
          return console.log(e)
        }
        break;

      default:
        console.log(`Invalid action found in message`)
        break;
    }
  })

  console.log(`Connection established to a client!`)
})

function noop() { }
function heartbeat() {
  this.isAlive = true
}