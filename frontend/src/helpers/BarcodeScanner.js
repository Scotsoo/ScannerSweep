import { EventEmitter } from 'events'
const eventKeys = {
  scanned: 'barcode-scanned'
}
export default class BarcodeScanner extends EventEmitter {
  constructor () {
    super()
    this.timeout = null
    this.cachedKeys = []
    const keyHandler = ({key}) => {
      if (key === 'Enter') {
        const value = this.cachedKeys.join('')
        if (['000000000284', '000000000291'].includes(value)) {
          return window.location.reload()
        }
        this.emit(eventKeys.scanned, value)
        clearTimeout(this.timeout)
        this.cachedKeys = []
      } else {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.cachedKeys = []
          console.log('cached keys reset cause of timeout')
        }, 500)
        this.cachedKeys.push(key)
      }
    }
    // don't ask any fkn questions please
    this.keyHandler = keyHandler.bind(this)
    // just don't.
  }

  static keys() {
    return eventKeys
  }

  destroy () {
    console.log('destroy called')
    window.removeEventListener('keydown', this.keyHandler)
  }

  register () {
    console.log('register called')
    window.addEventListener('keydown', this.keyHandler)
  }


}
