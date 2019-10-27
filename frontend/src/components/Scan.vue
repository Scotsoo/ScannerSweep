<template>
  <div class="">
    <table class="sticky-table">
      <thead class="header">
        <th colspan="2">
          Product
        </th>
        <th>
          Quantity
        </th>
        <th>
          Price
        </th>
      </thead>
      <tr class="bold total-row">
        <td colspan="2">
          Total
        </td>
        <td>
        </td>
        <td>
          {{totalPrice}}
        </td>
      </tr>
      <tbody>
        <tr v-for="scannedItemKey in Object.keys(scannedItems).reverse()" :key="scannedItemKey">
          <td colspan="2">
            {{scannedItems[scannedItemKey].name}}
          </td>
          <td>
            {{scannedItems[scannedItemKey].quantity}}
          </td>
          <td>
            £{{toMoney(calculatePrice(scannedItems[scannedItemKey]))}}
          </td>
        </tr>
      </tbody>
    </table>
    <Challenge></Challenge>
  </div>
</template>

<script>
import BarcodeScanner from '../helpers/BarcodeScanner'
const bcs = new BarcodeScanner()
import Challenge from './Challenge.vue'

export default {
  name: 'Scan',
  components: {Challenge},
  computed: {
    totalPrice: function () {
      let price = 0
      Object.values(this.$store.state.scannedItems).forEach(data => {
        price += this.calculatePrice(data)
      })
      return `£${this.toMoney(price)}`
    },
    userId: function() {
      const ignoreUserId = false
      if (ignoreUserId) {
        return 'Dev mode!!'
      }
      return this.$store.state.dCardId
    },
    scannedItems: function () {
      return this.$store.state.scannedItems
    }
  },
  methods: {
    calculatePrice (item) {
      return (item.quantity * item.price)
    },
    toMoney (value) {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
  },
  created: function () {
    if (this.userId.length === 0) {
      // redirect to login if no dCard is scanned
      return this.$router.push('/')
    }
    bcs.register()
    bcs.on(BarcodeScanner.keys().scanned, (barcode) => {
      this.$webSocket.scanItem(barcode)
    })
  },
  beforeDestroy: function () {
    bcs.destroy()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.total-row {
  background-color:#D97904;
}
.header {
  background-color:#8C0B47;
}
.sticky-table{
  width:100vw;
}
.bold  {
  font-weight: bolder
}
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
