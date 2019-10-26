export default class WebSocketHelper {
  constructor() {
  }

  constructWebSocketItem(action, payload) {
    console.log('constructing websocket item', action)
    const { dCardId } = this.vueContext.$store.state
    return JSON.stringify({
      session: dCardId,
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
        this.vueContext.$store.commit('pushScannedItem', message.payload, true)
      } else if (message.action === 'initResponse') {
        console.log('initresponse', message)
        this.vueContext.$store.commit('storeInitData', message.payload, true)
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