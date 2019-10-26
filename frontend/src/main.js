import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from './components/Home'
import Scan from './components/Scan'
import WebSocketHelper from './helpers/WebSocketHelper'

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
    scannedItems: {}
  },
  mutations: {
    storeDCard (state, value) {
      state.dCardId = value
    },
    pushScannedItem (state, item) {
      console.log('item', item)
      const statTemp = state.scannedItems
      let currentItems = statTemp[item.barcode]
      if (!currentItems) {
        currentItems = {
          barcode: item.barcode,
          name: item.name,
          quantity: 0,
          price: item.price
        }
      }
      currentItems.quantity++
      statTemp[item.barcode] = currentItems
      state.scannedItems = Object.assign({}, statTemp)
    }
  }
})

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false
const webSocket = new WebSocketHelper()
Vue.prototype.$webSocket = webSocket

webSocket.register(this)
const v = new Vue({
  render: h => h(App),
  router,
  store,
  template: '<App/>',
  created() {
  }
}).$mount('#app')
Vue.prototype.$webSocket.register(v)
