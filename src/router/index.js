import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Clientes from '../components/Cliente.vue'
import Articulos from '../components/Articulo.vue'
import Articulos2 from '../components/Articulo2.vue'
import Configuraciones from '../components/Configuracion.vue'
import Ventas from '../components/Ventas.vue'
import Ventas2 from '../components/Ventas2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  { 
    path: '/Clientes',
    name: 'Clientes',
    component: Clientes
  },
  { 
    path: '/Articulos',
    name: 'Articulos',
    component: Articulos
  },
  { 
    path: '/Configuraciones',
    name: 'Configuraciones',
    component: Configuraciones
  },
  
  { 
    path: '/Ventas2',
    name: 'Ventas2',
    component: Ventas2
  },

]

const router = new VueRouter({ 
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

