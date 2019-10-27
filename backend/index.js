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

    const newDiscount = await dbHelpers.generateDiscount(product)
    // newDiscount.save()

    const newChallenge = new Challenge({
      id: uuid.v4(),
      discount: newDiscount.id,
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

        setTimeout(recursiveChallenge, 1000, id)
      }
    }

    setTimeout(recursiveChallenge, 1000, newChallenge.id)
  }, 1000 * helpers.generateRandomChallengeInterval())
}

challengeGenerator()

wss.on('connection', function connection(ws) {
  ws.isAlive = true

  function checkClient () {
    console.log('checking for alive clients')
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        console.log('EXTERMINATE')
        return ws.terminate()
      }
      console.log('marked as ded')
      ws.isAlive = false
      console.log('issued ping')
      ws.ping(null, false, true)
    })
  }

  setInterval(checkClient, 60000)

  ws.on('pong', () => {
    console.log('pong received. marked alive')
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
          const challenge = await dbHelpers.findChallengeWithTimeRemaining()

          const newProduct = await handler.add(req.payload, session)

          if (challenge && challenge.product === newProduct.id) {
            challenge.timeRemaining = 0
            challenge.save()
            console.log('challenge', challenge)
            const discount = await dbHelpers.getDiscountById(challenge.discount)

            session.discounts.push(discount)
            session.save()
            console.log('DISCOUNT', discount)
            helpers.send(ws, {
              action: 'challenge_complete',
              payload: discount
            })
          }
          
          helpers.send(ws, {
            action: 'added',
            payload: newProduct
          })
          
          
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
                items: [],
                discounts: []
            })
        } else {
            console.log('session found for ', req.session)
        }
        ws.id = req.session
        ws.session = session
        await ws.session.save()
        const items = await Promise.all(session.items.map(async m => {
            let product = await dbHelpers.getProductById(m.id)
            product = JSON.parse(JSON.stringify(product))
            product.quantity = m.quantity
            return product
        }))
        const mappedItems = {}
        items.forEach(item => {
            mappedItems[item.id] = item
        })
        const discounts = await Promise.all(session.discounts.map(async m => {
          let discount = await dbHelpers.getDiscountById(m.id)
          discount = JSON.parse(JSON.stringify(discount))
          return discount
        }))
        const mappedDiscounts = {}
        discounts.forEach(discount => {
          mappedDiscounts[discount.id] = discount
        })
        ws.send(JSON.stringify({
            action: 'initResponse',
            payload: {
              mappedItems,
              mappedDiscounts
            }
        }))
        break;

      default:
        console.log(`Invalid action found in message`)
        break;
    }
  })

  console.log(`Connection established to a client!`)
})