<template>
  <div class="hello">
    <h1>Welcome to Scanner Sweep</h1>
    <h2>Scan your D-Card</h2>

    <h1>Your D-Card: {{scannedBarcode}}</h1>
  </div>
</template>

<script>
import BarcodeScanner from '../helpers/BarcodeScanner'
export default {
  name: 'Home',
  data () {
    return {
      scannedBarcode: '',
    }
  },
  created: function () {
    const bcs = new BarcodeScanner()
    bcs.register()
    bcs.on(BarcodeScanner.keys().scanned, (barcode) => {
      this.scannedBarcode = barcode
    })
  },
  beforeDestroy: function () {
    // window.removeEventListener('keydown', (event) => {
      // console.log(event)
    // })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
