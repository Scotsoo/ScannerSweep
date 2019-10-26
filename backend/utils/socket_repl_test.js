const WebSocket = require('ws')

const ws = new WebSocket('ws://localhost:8081')

ws.onopen = _ => {
    console.log('Connected!')
}

ws.onmessage = (e) => {
    console.log('Incoming message...', e.data)
}

const standardInput = process.stdin
standardInput.setEncoding('utf-8')

standardInput.on('data', function(data) {
    if (data === 'exit') {
        console.log('Closing...')
        process.exit(0)
    } else {
        ws.send(data)
    }
})