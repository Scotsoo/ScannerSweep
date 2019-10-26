const Session = require('../models/Session')

async function getSessionFromId (id) {
  const session = await Session.findOne({ id }).exec()
  return session
}

module.exports = {
  getSessionFromId
}