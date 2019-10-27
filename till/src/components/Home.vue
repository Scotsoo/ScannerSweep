<template>
  <div class="hello">
    <div>
      <barcode :value="barcode" :options="{ displayValue: true }"></barcode>
    </div>
    <div v-if=items>
      <table class="text-left sticky-table">
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
          <tr v-for="discountedItem in Object.values(discounts).reverse()" :key="discountedItem.id">
            <td colspan="2">
              {{discountedItem.description}}
            </td>
            <td>1</td>
            <td>
              -£{{toMoney(discountedItem.amount)}}
            </td>
          </tr>
        <tr v-for="scannedItemKey in Object.keys(items).reverse()" :key="scannedItemKey">
            <td colspan="2">
              {{items[scannedItemKey].name}}
            </td>
            <td>
              {{items[scannedItemKey].quantity}}
            </td>
            <td>
              £{{toMoney(calculatePrice(items[scannedItemKey]))}}
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <b-button variant="success" v-on:click="payment">Pay</b-button>
      </div>
    </div>
  </div>
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
      session: null,
      items: null,
      discounts: null,
      ws: null
    }
  },
  computed: {
    totalPrice: function () {
      let price = 0
      Object.values(this.items).forEach(data => {
        price += this.calculatePrice(data)
      })
      Object.values(this.discounts).forEach(data => {
        price -= data.amount
      })
      return `£${this.toMoney(price)}`
    },
    scannedItems: function () {
      return this.items
    }
  },
  methods: {
    reset() {
      this.items = null
      this.discounts = null
      this.session = null
    },
    payment() {
      alert("Thanks!")
      this.ws.send(JSON.stringify({
        'action': 'payment',
        'session': this.session
      }))
      this.reset()
    },
    calculatePrice (item) {
      return (item.quantity * item.price)
    },
    toMoney (value) {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
    }
  },
  created: function() {
    this.ws = new WebSocketHelper(this.barcode)
    this.ws.listen((data) => {
      data = JSON.parse(data.data);
      if (data.action == "checkout") {
        console.log(data.payload)
        this.session = data.payload.id
        this.items = data.payload.items
        this.discounts = data.payload.discounts
      }
    })
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

</style>
