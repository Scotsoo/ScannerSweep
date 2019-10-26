const WebSocket = require('ws')
const handler = require('./handler')
const mongoose = require('mongoose')
const Session = require('./models/Session')
const uuid = require('uuid')
const dbHelpers = require('./utils/dbHelpers')

const wss = new WebSocket.Server({ port: 8081 })
mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

wss.on('connection', function connection(ws) {
  ws.isAlive = true
  ws.on('pong', heartbeat)
//   ws.id = uuid.v4()
  ws.session = new Session({
      id: ws.id,
      items: []
  })

  ws.session.save()

  const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate()
      ws.isAlive = false
      ws.ping(noop)
    })
  }, 30000)

  ws.on('message', async function incoming(message) {
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
          const session = await dbHelpers.getSessionFromId(req.session)
          const newProduct = await handler.add(req.payload, session)
          ws.send(JSON.stringify({
            action: 'added',
            payload: newProduct
          }))
        }
        catch (e) {
          return console.log(e)
        }
        break;
      case "init":
        // let session = sessions[req.session]
        let session = await dbHelpers.getSessionFromId(req.session)
        if(!session) {
            console.log('session not found, creating new one', req.session)
            session = new Session({
                id: req.session,
                items: []
            })
        } else {
            console.log('session found for ', req.session)
        }
        ws.session = session
        await ws.session.save()
        const items = await Promise.all(session.items.map(async m => {
            let product = await dbHelpers.getProductById(m.id)
            product = JSON.parse(JSON.stringify(product))
            product.quantity = m.quantity
            console.log('PRODUCT', product)
            return product
        }))
        const mappedItems = {}
        items.forEach(item => {
            mappedItems[item.id] = item
        })
        ws.send(JSON.stringify({
            action: 'initResponse',
            payload: mappedItems
        }))
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