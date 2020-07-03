import Vue from 'vue'
import Vuex from 'vuex'
//ç¼“å­˜å·¥å…·
import vuexPersistedstate from 'vuex-persistedstate'

//layout
import navigator from './layout/navigator'

//security
import authConfig from './security/authConfig'
import login from './security/login'
import register from './security/register'

//水印管理
import watermark from './watermark/watermark'

//存储管理
import logs from './storage/logs' //日志列表
import storeClean from './storage/storeClean' //存储清理
import cleanStrategy from './storage/cleanStrategy' //清理策略
import alarmConfig from './storage/alarmConfig' //报警列表
import storeManage from './storage/storeManage' //存储管理

//权限管理
import interfaceManagement from './auth/interfaceManagement'
import auth from './auth/auth'

//文档中心
import fileManagement from './file/fileManagement'
import fileShare from './file/fileShare'
import fileUploadUser from './file/fileUploadUser' //大文件上传用户

//公共目录
import directory from './directory/directory'
import preview from './directory/preview'
import fileUpload from './directory/fileUpload' //大文件上传
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        navigator,
        authConfig,
        login,
        register,
        watermark,
        logs,
        storeClean,
        cleanStrategy,
        alarmConfig,
        storeManage,
        interfaceManagement,
        fileManagement,
        fileShare,
        directory,
        preview,
        auth,
        fileUpload,
        fileUploadUser
    },
    strict: process.env.NODE_ENV !== 'production',
    // stare cache
    plugins: [vuexPersistedstate({ storage: window.localStorage })]
})
