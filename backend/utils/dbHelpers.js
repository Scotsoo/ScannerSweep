const Challenge = require('../models/Challenge')
const Product = require('../models/Product')
const Session = require('../models/Session')
const Discount = require('../models/Discount')

const helpers = require('./helpers')
const uuid = require('uuid')

async function getSessionFromId (id) {
  const session = await Session.findOne({ id }).exec()
  return session
}
async function getProductById (id) {
  const session = await Product.findOne({ id }).exec()
  return session
}

async function findChallengeById (id) {
  const challenge = await Challenge.findOne({ id }).exec()
  return challenge
}

async function findChallengeWithTimeRemaining() {
  const challenge = await Challenge.findOne({ timeRemaining: { '$gt': 0 } })
  return challenge
}

async function findRandomProduct () {
  const allProducts = await Product.find({})
  if (!allProducts.length) throw new Error('No products found')

  return allProducts[helpers.generateRandomFromArrayLength(allProducts.length)]
}

async function generateDiscount (product) {
  const isPercentDiscount = !!Math.round(Math.random())
  const percentDiscount = helpers.generateRandomDiscountPercent(product.price)
  const flatDiscount = helpers.generateRandomDiscountAmount(product.price)

  const discount = new Discount({
    id: uuid.v4(),
    amount: isPercentDiscount
      ? percentDiscount.amount
      : flatDiscount,
    description: `${isPercentDiscount ? `${percentDiscount.percent}%` : `£${flatDiscount.toFixed(2)}`} discount on ${product.name}`
  })

  discount.save()

  return discount
}

async function getDiscountById (id) {
  const discount = await Discount.findOne({ id }).exec()
  return discount
}


module.exports = {
  generateDiscount,
  getDiscountById,
  getProductById,
  getSessionFromId,
  findChallengeById,
  findChallengeWithTimeRemaining,
  findRandomProduct
}