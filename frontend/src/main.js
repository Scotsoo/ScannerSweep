import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import Home from './components/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/', component: Home, name: 'Home'
  }
]

const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  template: '<App/>',
}).$mount('#app')
