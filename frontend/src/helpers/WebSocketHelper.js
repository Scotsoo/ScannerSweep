export default class WebSocketHelper {
  constructor() {
  }

  register(vueContext) {
    this.vueContext = vueContext
    this.websocket = new WebSocket('ws://localhost:8081')
    this.websocket.addEventListener('message', (data) => {
      const message = JSON.parse(data.data)
      if (message.action === 'added') {
        this.vueContext.$store.commit('pushScannedItem', message.payload)
      }
    })
  }

  scanItem (barcode) {
    const item = {
      action: 'add',
      payload: barcode
    }
    this.websocket.send(JSON.stringify(item))
  }

  destroy () {
    this.websocket.close()
  }
}