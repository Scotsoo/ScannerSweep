const WebSocket = require('ws')

function generateRandomFromArrayLength(length) {
    return generateRandom(length)
}

function generateRandomChallengeInterval() {
    // every 40-100 seconds
    return generateRandom(60) + 40
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
    const priceAmount = +(discount * productPrice).toFixed(2)
    return {
        percent: discount,
        amount: priceAmount
    }
}

function generateRandomDiscountAmount (productPrice) {
    return +generateRandom(productPrice).toFixed(2)
}

module.exports = {
    broadcast: broadcastWrapper,
    generateRandom,
    generateRandomChallengeInterval,
    generateRandomDiscountAmount,
    generateRandomDiscountPercent,
    generateRandomFromArrayLength,
    send: sendWrapper
}