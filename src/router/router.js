import Vue from 'vue'
import VueRouter from 'vue-router'

//公共目录
import directory from './module/directory'

//文档中心
import file from './module/file'

//权限管理
import auth from './module/auth'

//存储管理
import store from './module/store'

//水印管理
import watermark from './module/watermark'

//外部引入路由对象
let routes_module = [directory, file, auth, store, watermark]

//通用子路由
let children_routes = [
    {
        path: '/directory',
        name: 'directory',
        component: () => import('@/views/directory/directory.vue')
    }
]

//合并路由
routes_module.forEach(e => (children_routes = children_routes.concat(e)))

let routes = [
    {
        path: '/',
        redirect: '/directory'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/layout/register.vue')
    },
    {
        path: '/platform',
        name: 'platform',
        component: () => import('@/views/main.vue'),
        children: children_routes
    }
]

Vue.use(VueRouter)
const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router
