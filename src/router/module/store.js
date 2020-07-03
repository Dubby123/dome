const routes = [
    {
        path: '/store', //存储管理
        name: 'store',
        component: () => import('@/views/store/storageMonitor.vue')
    },
    {
        path: '/store/mange', //存储管理
        name: 'store_mange',
        component: () => import('@/views/store/storageMonitor.vue')
    },
    //新增储存
    {
        path: '/store/mange/add',
        name: 'addStorageMonitor',
        component: () => import('@/views/store/formComp/storageForm.vue')
    },
    //修改储存
    {
        path: '/store/mange/edit',
        name: 'editStorageMonitor',
        component: () => import('@/views/store/formComp/storageForm.vue')
    },
    {
        path: '/store/alarm', //报警列表
        name: 'store_alarm',
        component: () => import('@/views/store/alarmConfig.vue')
    },
    {
        path: '/store/alarm/add', //新增报警
        name: 'addAlarm',
        component: () => import('@/views/store/formComp/alarmForm.vue')
    },
    {
        path: '/store/strategy', //清理策略
        name: 'cleanStrategy',
        component: () => import('@/views/store/cleanStrategy.vue')
    },
    //新增策略
    {
        path: '/store/strategy/add',
        name: 'addStrategy',
        component: () => import('@/views/store/formComp/strategyForm.vue')
    },
    {
        path: '/store/clean', //存储清理
        name: 'store_clean',
        component: () => import('@/views/store/storeClean.vue')
    },
    {
        path: '/store/log', //日志列表
        name: 'store_log',
        component: () => import('@/views/store/log.vue')
    }
]

export default routes
