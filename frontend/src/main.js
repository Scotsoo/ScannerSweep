import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Home from './components/Home'
import Scan from './components/Scan'


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
    pushScannedItem (state, value) {
      const statTemp = state.scannedItems
      let currentItems = statTemp[value]
      if (!currentItems) {
        currentItems = {
          barcode: value,
          name: 'FILL ME IN AT SOME POINT FROM API???',
          quantity: 0,
          price: '222.22' //todo: GET FROM API
        }
      }
      currentItems.quantity++
      statTemp[value] = currentItems
      state.scannedItems = Object.assign({}, statTemp)
    }
  }
})

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  template: '<App/>',
}).$mount('#app')
