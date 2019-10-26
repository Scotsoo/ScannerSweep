import { EventEmitter } from 'events'
const eventKeys = {
  scanned: 'barcode-scanned'
}
export default class BarcodeScanner extends EventEmitter {
  constructor () {
    super()
    this.timeout = null
  }
  static keys() {
    return eventKeys
  }
  register () {
    console.log('register called')
    let cachedKeys = []
    window.addEventListener('keydown', ({key}) => {
      if (key === 'Enter') {
        this.emit(eventKeys.scanned, cachedKeys.join(''))
        clearTimeout(this.timeout)
        cachedKeys = []
      } else {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          cachedKeys = []
          console.log('cached keys reset cause of timeout')
        }, 200)
        cachedKeys.push(key)
      }
    })
  }
}
