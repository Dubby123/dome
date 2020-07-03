import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
//UI 组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//异步请求组件
import axios from 'axios'
//动态配置url工具类
import api from '@/common/api'
// import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import uploader from 'vue-simple-uploader'
Vue.config.productionTip = false
var __vue = null

//初始化vue
//动态配置后台服务器地址&微服务
;(function() {
    axios.defaults.withCredentials = true
    axios.get('./baseUrl.json').then(res => {
        Vue.config.productionTip = false
        api.setHost(res.data.baseUrl)
        api.setExUrl(res.data.exUrl)
        api.setGeneratorUrl(res.data.generatorUrl)
        api.setLogoutUrl(res.data.logoutUrl)
        Vue.use(ElementUI)
        Vue.use(uploader)
        __vue = new Vue({
            router,
            store,
            render: h => h(App)
        }).$mount('#app')
    })
})()

export default __vue
