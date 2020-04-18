import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Smarket from './plugins/smarket-kit';
import jQuery from 'jquery'

//import './assets/scss/app.scss'
import 'popper.js'
import 'bootstrap'
window.$ = window.jQuery = jQuery


Vue.config.productionTip = false
Vue.use(Smarket);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
