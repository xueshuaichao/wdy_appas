import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/antd'
import './components/moduleFields/viewIndex'

import './less/cssReset.css'
import './assets/iconfont/iconfont.css'

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
