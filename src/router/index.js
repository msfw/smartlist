import Vue from 'vue'
import VueRouter from 'vue-router'
import AppHeader from '../layout/AppHeader.vue'
import MainList from '../views/Lists.vue'
import ListView from '../views/ListView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Lists',
    components: {
      //sidebar: SideBar,
      header: AppHeader,
      default: MainList
    }
  },
  {
    path: '/list/:sku',
    name: 'ListView',
    components: {
      header: AppHeader,
      default: ListView
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
