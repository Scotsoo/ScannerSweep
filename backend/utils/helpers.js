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
    wss.client.forEach(function broadcastEach(client) {
        if (client.readyState === WebSocket.OPEN) {
            clients++
            sendWrapper(client, object)
        }
    })

    console.log(`Sent to ${clients} client/s:`, object)
}

modules.exports = {
    broadcast: broadcastWrapper,
    generateRandom,
    generateRandomChallengeInterval,
    generateRandomFromArrayLength,
    send: sendWrapper
}