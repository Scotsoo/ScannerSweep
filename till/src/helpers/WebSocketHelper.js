export default class WebSocketHelper {
  constructor(barcode) {
    this.websocket = new WebSocket('ws://hack19.mindez.co.uk:80');
    this.websocket.onopen = ()=>{
      this.initSession(barcode);
    }
  }

  listen(cb) {
    this.websocket.addEventListener('message', cb);
  }

  send(data) {
    this.websocket.send(data)
  }

  initSession(barcode) {
    console.log("here")
    this.send(JSON.stringify({'action': 'registerTill', 'barcode':barcode}))
  }

  scanItem (barcode) {
    const item = this.constructWebSocketItem('add', barcode)
    this.websocket.send(item)
  }


  destroy () {
    this.websocket.close()
  }
}
