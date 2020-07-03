const routes = [
    {
        path: '/watermark', //水印管理
        name: 'watermark',
        component: () => import('@/views/watermark/watermark.vue')
    }
]

export default routes
