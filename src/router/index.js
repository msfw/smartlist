import Vue from 'vue'
import VueRouter from 'vue-router'
import AppHeader from '../layout/AppHeader.vue'
//import AppFooter from '../layout/AppFooter.vue'
import Home from '../views/Home.vue'
import List from '../views/List.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    components: {
      header: AppHeader,
      default: Home
    }
  },
  {
    path: '/list/:sku',
    name: 'list',
    components: {
      header: AppHeader,
      default: List,
      //footer: AppFooter
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
