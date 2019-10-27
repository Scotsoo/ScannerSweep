const Challenge = require('../models/Challenge')
const Product = require('../models/Product')
const Session = require('../models/Session')
const CrypticProduct = require('../models/CrypticProduct')

const helpers = require('./helpers')

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

async function findCrypticProductByProductId (id) {
  const crypticProduct = await CrypticProduct.findOne({ productId: id }).exec()
  return crypticProduct
}


module.exports = {
  getSessionFromId,
  findChallengeById,
  findChallengeWithTimeRemaining,
  findCrypticProductByProductId,
  findRandomProduct,
  getProductById
}