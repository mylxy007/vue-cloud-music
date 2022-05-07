import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
// 引入rem，页面自适应
// import './utils/rem'
// import './utils/rem'
// 引入store
import store from '@/store'
// 引入接口API
import api from '@/api'
Vue.prototype.$API = api;
// 引入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  }
}).$mount('#app')