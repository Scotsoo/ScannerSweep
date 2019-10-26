const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
    ws.isAlive = true
    ws.on('pong', heartbeat)

    const interval = setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) return ws.terminate()
            ws.isAlive = false
            ws.ping(noop)
        })
    }, 30000)

    ws.on('message', function incoming(message) {
        console.log(`Recieved message "${message}"`)
    })

    ws.on('add', function handleAdd(id) {
        console.log(`Received add message with id ${id}`)
    }
    
    console.log(`Connection established to a client!`)
})

function noop() {}
function heartbeat() {
    this.isAlive = true
}