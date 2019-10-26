const WebSocket = require('ws')
const handler = require('./handler')
const mongoose = require('mongoose')
const Session = require('./models/Session')
const Challenge = require('./models/Challenge')
const uuid = require('uuid')
const dbHelpers = require('./utils/dbHelpers')
const helpers = require('./utils/helpers')

const wss = new WebSocket.Server({ port: 8081 })
mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })

const challengeInterval = setTimeout(async () => {
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
      helpers.broadcast(ws, {
        action: 'challenge_end'
      })
    } else {
      challenge.timeRemaining--
      challenge.save()

      helpers.broadcast(wss, {
        action: 'challenge',
        payload: challenge
      })

      return Promise.delay(1000).then(() => recursiveChallenge(id))
    }
  }

  Promise.delay(1000).then(() => recursiveChallenge(newChallenge.id))
}, 1000 * helpers.generateRandomChallengeInterval())

wss.on('connection', function connection(ws) {
  ws.id = uuid.v4()
  ws.session = new Session({
      id: ws.id,
      items: []
  })

  ws.session.save()
  helpers.send(ws, {
    action: 'init',
    payload: ws.id
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
            helpers.send(ws, {
              action: 'challenge_complete'
            })
          }
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