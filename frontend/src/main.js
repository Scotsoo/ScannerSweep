import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from './components/Home'
import Scan from './components/Scan'
import WebSocketHelper from './helpers/WebSocketHelper'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)



const routes = [
  {
    path: '/', component: Home, name: 'Home'
  },
  {
  path: '/scan', component: Scan, name: 'Scan'
  }
]

const store = new Vuex.Store({
  state: {
    dCardId: '',
    scannedItems: {},
    discountedItems: {},
    websocketSessionId: ''
  },
  mutations: {
    storeDCard (state, value) {
      state.dCardId = value
    },
    pushScannedItem (state, item) {
      const statTemp = state.scannedItems
      let currentItems = statTemp[item.id]
      console.log('id', item.id)
      if (!currentItems) {
        currentItems = {
          id: item.id,
          name: item.name,
          quantity: 0,
          price: item.price
        }
      }
      currentItems.quantity++
      statTemp[item.id] = currentItems
      state.scannedItems = Object.assign({}, statTemp)
    },
    storeInitData (state, items) {
      state.scannedItems = Object.assign({}, items.mappedItems)
      console.log(items)
      state.discountedItems = Object.assign({}, items.mappedDiscounts)
      // state.websocketSessionId = sessionId
    },
    storeDiscount(state, discount) {
      const statTemp = state.discountedItems
      let currentItems = statTemp[discount.id]
      if (!currentItems) {
        currentItems = {
          id: discount.id,
          description: discount.description,
          amount: discount.amount
        }
      }
      statTemp[discount.id] = currentItems
      state.discountedItems = Object.assign({}, statTemp)
    }
  }
})

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false
const webSocket = new WebSocketHelper()
Vue.prototype.$webSocket = webSocket
const v = new Vue({
  render: h => h(App),
  router,
  store,
  template: '<App/>',
  created() {
  }
}).$mount('#app')
webSocket.register(v)
// Vue.prototype.$webSocket.register(v)
