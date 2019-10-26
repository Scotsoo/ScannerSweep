export default class WebSocketHelper {
  constructor() {
  }

  constructWebSocketItem(action, payload) {
    const { websocketSessionId } = this.vueContext.$store.state
    return JSON.stringify({
      session: websocketSessionId,
      action,
      payload
    })
  }

  register(vueContext) {
    this.vueContext = vueContext
    // this.websocket = new WebSocket('ws://hack19.mindez.co.uk:80')
    this.websocket = new WebSocket('ws://localhost:8081')
    this.websocket.addEventListener('message', (data) => {
      const message = JSON.parse(data.data)
      if (message.action === 'added') {
        this.vueContext.$store.commit('pushScannedItem', message.payload)
      } else if (message.action === 'init') {
        this.vueContext.$store.commit('storeWebSocketSessionId', message.payload)
      }
    })
  }

  initSession(barcode) {
    this.websocket.send(this.constructWebSocketItem('init', barcode))
  }

  scanItem (barcode) {
    const item = this.constructWebSocketItem('add', barcode)
    this.websocket.send(item)
  }


  destroy () {
    this.websocket.close()
  }
}