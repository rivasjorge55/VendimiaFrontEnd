import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios';



Vue.config.productionTip = false
//DEVELOP 
//axios.defaults.baseURL='http://localhost:5555/' 

//PUBLISH 
axios.defaults.baseURL=  'http://sffacturacion.ddns.net:5555/'

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
