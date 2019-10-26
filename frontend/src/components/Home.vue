<template>
  <div class="hello">
    <h1>Welcome to Scanner Sweep</h1>
    <h2>Please Scan your DCard to begin</h2>
  </div>
</template>

<script>
import BarcodeScanner from '../helpers/BarcodeScanner'
const bcs = new BarcodeScanner()
export default {
  name: 'Home',
  created: function () {
    bcs.register()
    bcs.on(BarcodeScanner.keys().scanned, (barcode) => {
      this.$store.commit('storeDCard', barcode)
      this.$router.push('Scan')
    })
  },
  beforeDestroy: function () {
    bcs.destroy()
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
