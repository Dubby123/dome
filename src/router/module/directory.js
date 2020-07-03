const routes = [
    {
        path: '/directory', //公共目录
        name: 'directory',
        component: () => import('@/views/directory/directory.vue')
    },
    {
        path: '/directory/preview', //公共目录文档预览
        name: 'preview',
        component: () => import('@/views/directory/preview.vue')
    },
    {
        path: '/directory/preview/apply', //用户预览申请过的文件
        name: 'applyPreview',
        component: () => import('@/views/directory/apply.vue')
    },
    {
        path: '/directory/download/apply', //用户下载申请过的文件
        name: 'applyDownload',
        component: () => import('@/views/directory/download.vue')
    }
]

export default routes
