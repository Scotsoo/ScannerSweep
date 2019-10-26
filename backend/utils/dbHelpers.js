const Session = require('../models/Session')
const Product = require('../models/Product')

async function getSessionFromId (id) {
  const session = await Session.findOne({ id }).exec()
  return session
}
async function getProductById (id) {
  const session = await Product.findOne({ id }).exec()
  return session
}

module.exports = {
  getSessionFromId,
  getProductById
}