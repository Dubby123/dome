const routes = [
    {
        path: '/file', //文档中心
        name: 'file',
        component: () => import('@/views/file/documentCenter.vue')
    },
    {
        path: '/file/fileShare', //文件分享
        name: 'fileShare',
        component: () => import('@/views/file/fileMange/fileShare.vue')
    }
]

export default routes
