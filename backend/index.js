const WebSocket = require('ws')
const handler = require('./handler')
const mongoose = require('mongoose')
const Session = require('./models/Session')
const Challenge = require('./models/Challenge')
const uuid = require('uuid')
const dbHelpers = require('./utils/dbHelpers')
const helpers = require('./utils/helpers')

const wss = new WebSocket.Server({ port: 8086 })
mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

function challengeGenerator () {
  setTimeout(async () => {
    const product = await dbHelpers.findRandomProduct()
    const time = Math.round(Math.floor(helpers.generateRandom(20))) + 10

    const newChallenge = new Challenge({
      id: uuid.v4(),
      product: product.id,
      text: `Scan ${product.name}`,
      timeRemaining: time
    })

    newChallenge.save()

    helpers.broadcast(wss, {
      action: 'challenge',
      payload: newChallenge
    })

    async function recursiveChallenge(id) {
      let challenge
      try {
        challenge = await dbHelpers.findChallengeById(id)
      } catch (e) {
        console.error(`Challenge with ID "${id}" doesn't exist in DB`)
        return
      }

      if (challenge.timeRemaining === 0) {
        Challenge.deleteOne(challenge)
        helpers.broadcast(wss, {
          action: 'challenge_end'
        })
        challengeGenerator()
      } else {
        challenge.timeRemaining--
        challenge.save()

        helpers.broadcast(wss, {
          action: 'challenge',
          payload: challenge
        })

        return setTimeout(recursiveChallenge, 1000, id)
      }
    }

    setTimeout(recursiveChallenge, 1000, newChallenge.id)
  }, 1000 * helpers.generateRandomChallengeInterval())
}

challengeGenerator()

wss.on('connection', function connection(ws) {
  ws.id = uuid.v4()
  ws.session = new Session({
      id: ws.id,
      items: []
  })
  ws.isAlive = true

  ws.session.save()

  function checkClient () {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) return ws.terminate()

      ws.isAlive = false
      ws.ping(null, false, true)
    })

    setTimeout(checkClient, 10000)
  }

  setTimeout(checkClient, 10000)

  ws.on('pong', () => {
    ws.isAlive = true
  })

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
          
          helpers.send(ws, {
            action: 'added',
            payload: newProduct
          })
          
          const challenge = await dbHelpers.findChallengeWithTimeRemaining()
          if (challenge && challenge.product === newProduct.id) {
            challenge.timeRemaining = 0
            challenge.save()
            
            helpers.send(ws, {
              action: 'challenge_complete'
            })
          }
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