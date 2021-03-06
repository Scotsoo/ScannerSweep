const WebSocket = require('ws')

function generateRandomFromArrayLength(length) {
    return generateRandom(length)
}

function generateRandomChallengeInterval() {
    // every 40-100 seconds
    const r = generateRandom(60) + 40
    console.log('random interval', r)
    return r
}

function generateRandom(ceiling) {
    return Math.floor(Math.random() * ceiling)
}

function sendWrapper(ws, object) {
    ws.send(JSON.stringify(object))
}

function broadcastWrapper(wss, object) {
    let clients = 0
    wss.clients.forEach(function broadcastEach(client) {
        if (client.readyState === WebSocket.OPEN) {
            clients++
            sendWrapper(client, object)
        }
    })

    console.log(`Sent to ${clients} client/s:`, object)
}

function generateRandomDiscountPercent (productPrice) {
    const discount = generateRandom(50)
    console.log(`discount percent`, discount)
    const priceAmount = roundToCurrency((discount / 100) * productPrice)
    console.log('discount percent amount', priceAmount)
    return {
        percent: discount,
        amount: priceAmount
    }
}

function roundToCurrency (value) {
    return Math.round(value * 100) / 100
}

function coinToss () {
    return !!Math.round(Math.random())
}

module.exports = {
    broadcast: broadcastWrapper,
    coinToss,
    generateRandom,
    generateRandomChallengeInterval,
    generateRandomDiscountPercent,
    generateRandomFromArrayLength,
    send: sendWrapper
}