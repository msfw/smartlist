import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

// Modules
import auth from './modules/auth'
import list from './modules/list'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'smartlist',
  storage: window.localStorage
})

export default new Vuex.Store({
  modules: { auth, list },
  plugins: [ vuexLocalStorage.plugin ]
})
