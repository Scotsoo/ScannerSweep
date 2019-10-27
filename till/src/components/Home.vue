<template>
  <div class="hello">
    <barcode :value="barcode" :options="{ displayValue: true }"></barcode>
    <!-- <table class="sticky-table">
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
    </table> -->
  </div>
</template>

<script>
import Vue from 'vue'
import VueBarcode from '@xkeshi/vue-barcode'
import WebSocketHelper from '@/helpers/WebSocketHelper.js'

Vue.component(VueBarcode.name, VueBarcode)

export default {
  name: 'Home',
  components: {VueBarcode},
  data () {
    return {
      barcode: 'till000001',
      session: "000000000130",
      items: [
        {
          _id: "5db5102f50d1db1a20e68d62", id: "000000000048", quantity: 3
        }
      ]
    }
  },
  created: function() {
    const ws = new WebSocketHelper(this.barcode)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
