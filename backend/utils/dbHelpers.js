const Challenge = require('../models/Challenge')
const Product = require('../models/Product')
const Session = require('../models/Session')
const Discount = require('../models/Discount')
const helpers = require('../utils/helpers')
const CrypticProduct = require('../models/CrypticProduct')

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
  let func = () => {}
  if (helpers.coinToss()) {
    func = generateItemDiscount
  } else {
    func = generateFlatDiscount
  }

  return await func(product)
}

async function generateItemDiscount (product) {
  const percentDiscount = helpers.generateRandomDiscountPercent(product.price)

  const discount = new Discount({
    id: uuid.v4(),
    amount: percentDiscount.amount,
    description: `${percentDiscount.percent}% discount on ${product.name}`,
    percent: percentDiscount.percent,
    fullBasket: false
  })

  discount.save()

  return discount
}

async function generateFlatDiscount () {
  // Always generate an enumerable of 5, from 5 to 20
  const discountValue = generateRandom(3) * 5 + 5

  const discount = new Discount({
    id: uuid.v4(),
    amount: discountValue,
    description: `£${discountPercent}% off`,

  })

  discount.save()

  return discount
}

async function getDiscountById (id) {
  const discount = await Discount.findOne({ id }).exec()
  return discount
}

async function findCrypticProductByProductId (id) {
  const crypticProduct = await CrypticProduct.findOne({ productId: id }).exec()
  return crypticProduct
}

module.exports = {
  generateDiscount,
  generateItemDiscount,
  generateFlatDiscount,
  getDiscountById,
  getProductById,
  getSessionFromId,
  findChallengeById,
  findChallengeWithTimeRemaining,
  findCrypticProductByProductId,
  findRandomProduct,
  getProductById
}