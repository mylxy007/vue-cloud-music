import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 引入路由组件
import Home from '@/views/Home'
import PLDetail from '@/components/PLDetail'
const routes = [{
        path: '/home',
        component: Home
    },
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/plDetail',
        component: PLDetail
    }
]

export default new VueRouter({
    routes
})