import Vue from 'vue'
import VueCurrencyInput from 'vue-currency-input'
import jQuery from 'jquery'
import { localize } from 'vee-validate'

import { getLocalization } from './utils/localization'
import App from './App.vue'
import router from './router'
import store from './store'
import Smarket from './plugins/smarket-kit';

import { createI18n } from "./i18n/index";
//import i18n from './i18n/index'

//import './assets/scss/app.scss'
import 'popper.js'
import 'bootstrap'
window.$ = window.jQuery = jQuery

Vue.use(VueCurrencyInput)
Vue.use(Smarket);

Vue.config.productionTip = false
const i18n = createI18n();

const localization = getLocalization(i18n)
localize(localization.locale, localization.messages);


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
