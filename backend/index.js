const WebSocket = require('ws')
const handler = require('./handler')
const mongoose = require('mongoose')
const Session = require('./models/Session')
const Challenge = require('./models/Challenge')
const uuid = require('uuid')
const dbHelpers = require('./utils/dbHelpers')
const helpers = require('./utils/helpers')
const Tills = require("./models/Tills.js")
const TreasureHunt = require("./models/TreasureHunt.js")

const wss = new WebSocket.Server({ port: 8086 })
mongoose.connect('mongodb://localhost/scanner', { useNewUrlParser: true })
const tills = new Tills();
const treasure_hunt = new TreasureHunt()

function challengeGenerator () {
  setTimeout(async () => {
    const product = await dbHelpers.findRandomProduct()
    const time = Math.round(Math.floor(helpers.generateRandom(20))) + 10
	const crypticProduct = await dbHelpers.findCrypticProductByProductId(product.id)

    const newDiscount = await dbHelpers.generateDiscount(product)

	const newChallenge = new Challenge({
      id: uuid.v4(),
      discount: newDiscount.id,
      product: product.id,
      text: helpers.coinToss()
        ? `Be the first to scan ${product.name}`
        : crypticProduct.message,
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
    let session
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
          session = await dbHelpers.getSessionFromId(req.session)
          treasure_hunt.testChallenge(ws, req.payload)

          if (req.payload.startsWith("till") || req.payload === '000000000307') {
            console.log("Doing checkout")

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
            const discounts = await Promise.all(session.discounts.map(async m => {
              let discount = await dbHelpers.getDiscountById(m.id)
              discount = JSON.parse(JSON.stringify(discount))
              return discount
            }))
            const mappedDiscounts = {}
            discounts.forEach(discount => {
              mappedDiscounts[discount.id] = discount
            })
            tills.checkoutSession( {
              id: session.id,
              items: mappedItems,
              discounts: mappedDiscounts
            }, req.payload)
            ws.send(JSON.stringify({
             action: 'reset'
           }))
           return
          }
        const challenge = await dbHelpers.findChallengeWithTimeRemaining()
          if (req.payload == '000000000314') {
            return treasure_hunt.setChallenge(ws);
          }
          const newProduct = await handler.add(req.payload, session)

          if (challenge && challenge.product === newProduct.id) {
            challenge.timeRemaining = 0
            challenge.save()
            const discount = await dbHelpers.getDiscountById(challenge.discount)

            session.discounts.push(discount)

            helpers.send(ws, {
              action: 'challenge_complete',
              payload: discount
            })
          }
          const t = true
          if (helpers.generateRandom(9) === 0) {
            const gifs = [
              'https://media1.tenor.com/images/8dd6b22e13deb687fe7afb2b3d1dcc0c/tenor.gif?itemid=11680207',
              'https://media.giphy.com/media/FKijXRJNJ4KJi/giphy.gif',
              'https://media.giphy.com/media/FkzZKgDzvpIEo/giphy.gif',
              'https://media1.tenor.com/images/9bc60045bf988c03ebdbe09e50b20622/tenor.gif?itemid=11677344',
              'https://media1.tenor.com/images/fb746d001234747675d109cc6851d263/tenor.gif',
              'https://media.giphy.com/media/3o7WIuUib37DlSag8w/giphy.gif'

            ]
            const r = helpers.generateRandom(gifs.length)
            helpers.send(ws, {
              action: 'winton',
              payload: gifs[r]
            })
          }


          session.save()

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
        session = await dbHelpers.getSessionFromId(req.session)
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
    case "registerTill":
        console.log(req)
        tills.register(req.barcode, ws)
        break;

    case "payment":
        console.log(req.session)
        session = await dbHelpers.getSessionFromId(req.session)
        session.deleteOne()
        break;
    default:
        console.log(`Invalid action found in message`)
        break;
    }
  })

  console.log(`Connection established to a client!`)
})



