const routes = [
    {
        path: '/auth', //权限管理
        name: 'auth',
        component: () => import('@/views/auth/auth.vue')
    },
    {
        path: '/auth/directory', //公共目录权限
        name: 'directory_auth',
        component: () => import('@/views/auth/auth.vue')
    },
    {
        path: '/auth/file', //文件接口权限
        name: 'interfaceManagement',
        component: () => import('@/views/auth/interfaceManagement.vue')
    },
    {
        path: '/auth/file/add', //新增接口
        name: 'addInterface',
        component: () => import('@/views/auth/formComp/interfaceForm.vue')
    },
    {
        path: '/auth/file/edit', //修改接口
        name: 'editInterface',
        component: () => import('@/views/auth/formComp/interfaceForm.vue')
    }
]

export default routes
