/**
 * 分页页数定义
 */
const PAGESIZE_CONFIG = {
    normal: [10, 20, 50, 100]
}
/**
 * 后台请求结果status约定定义
 */
const STATUS = {
    SUCCESS: true,
    ERROR: false
}
/**
 * 导航栏权限列表
 * 根据code和后台进行匹配
 */
const NAV_LIST = [
    {
        name: '公共目录',
        context: '/directory',
        code: 'PLAT_KM_COMM_CATE',
        icon: 'file'
    },
    {
        name: '文档中心',
        context: '/file',
        code: 'PLAT_KM_FILE_CENTER',
        icon: 'log'
    },
    {
        name: '文件分享',
        context: '/file/fileShare'
    },
    {
        name: '权限管理',
        code: 'PLAT_KM_AUTH',
        context: '/auth',
        icon: 'auth'
    },
    {
        name: '存储管理',
        context: '/store/mange',
        code: 'PLAT_KM_STORAGE',
        icon: 'store'
    },
    {
        name: '存储管理',
        code: 'PLAT_KM_STORAGE_MANAGE',
        context: '/store/mange'
    },
    {
        name: '报警列表',
        code: 'PLAT_KM_STORAGE_ALARM',
        context: '/store/alarm'
    },
    {
        name: '清理策略',
        code: 'PLAT_KM_STORAGE_STRATEGY',
        context: '/store/strategy'
    },
    {
        name: '存储清理',
        code: 'PLAT_KM_STORAGE_CLEAR',
        context: '/store/clean'
    },
    {
        name: '日志列表',
        code: 'PLAT_KM_STORAGE_LOG',
        context: '/store/log'
    },
    {
        name: '水印管理',
        context: '/watermark',
        code: 'PLAT_KM_WATERMARK',
        icon: 'watermark'
    },
    {
        name: '公共目录权限',
        code: 'PLAT_KM_AUTH_CATEGORY',
        context: '/auth/directory'
    },
    {
        name: '文件接口权限',
        code: 'PLAT_KM_AUTH_INTERFACE',
        context: '/auth/file'
    },
    {
        name: '文档预览',
        context: '/directory/preview'
    },
    {
        name: '文档预览',
        context: '/directory/preview/apply'
    },
    {
        name: '文档下载',
        context: '/directory/download/apply'
    },
    {
        name: '新增存储',
        context: '/store/mange/add'
    },
    {
        name: '修改存储',
        context: '/store/mange/edit'
    },
    {
        name: '新增报警',
        context: '/store/alarm/add'
    },
    {
        name: '新增策略',
        context: '/store/strategy/add'
    },
    {
        name: '新增接口',
        context: '/auth/file/add'
    },
    {
        name: '修改接口',
        context: '/auth/file/edit'
    }
]
const NAV_LIST_SOFTWARE = [
    {
        name: '公共目录',
        code: 'PLAT_SOFTWARE_FACTORY',
        context: '/directory',
        icon: 'file'
    },
    {
        name: '文档中心',
        code: 'PLAT_SOFTWARE_FACTORY',
        context: '/file',
        icon: 'log'
    },
    {
        name: '权限管理',
        code: 'PLAT_SOFTWARE_FACTORYsssw',
        context: '/auth',
        icon: 'auth',
        childList: [
            {
                name: '公共目录权限',
                code: 'PLAT_AUTH_DIRECTORY',
                context: '/auth/directory'
            },
            {
                name: '文件接口权限',
                code: 'PLAT_FILE_AUTH',
                context: '/auth/file'
            }
        ]
    },
    {
        name: '存储管理',
        code: 'PLAT_SOFTWARE_FACTORYssa',
        context: '/store',
        icon: 'store',
        childList: [
            {
                name: '存储管理',
                code: 'PLAT_STORAGE_MANGE',
                context: '/store/mange'
            },
            {
                name: '报警列表',
                code: 'PLAT_STORAGE_ALARM',
                context: '/store/alarm'
            },
            {
                name: '清理策略',
                code: 'PLAT_STORAGE_STRATEGY',
                context: '/store/strategy'
            },
            {
                name: '存储清理',
                code: 'PLAT_STORAGE_CLEAN',
                context: '/store/clean'
            },
            {
                name: '日志列表',
                code: 'PLAT_STORAGE_LOG',
                context: '/store/log'
            }
        ]
    },
    {
        name: '水印管理',
        code: 'PLAT_WATERMARK',
        context: '/watermark',
        icon: 'watermark'
    }
]
/**
 * 页面按钮权限列表
 * 根据url + method进行匹配后台权限
 * 根据 tag 进行匹配页面按钮元素
 */
var OPERATE_AUTH = {}
const OPERATELIST = [
    //操作权限列表
    {
        id: 0,
        value: '权限设置'
    },
    {
        id: 1,
        value: '文件上传'
    },
    {
        id: 2,
        value: '文件下载'
    },
    {
        id: 3,
        value: '文件移动'
    },
    {
        id: 4,
        value: '文件复制'
    },
    {
        id: 5,
        value: '文件删除'
    },
    {
        id: 6,
        value: '文件重命名'
    },
    {
        id: 7,
        value: '文件预览'
    },
    {
        id: 8,
        value: '新建目录'
    },
    {
        id: 9,
        value: '修改目录'
    },
    {
        id: 10,
        value: '删除目录'
    },
    {
        id: 11,
        value: '文件评论'
    },
    {
        id: 12,
        value: '文件评分'
    },
    {
        id: 13,
        value: '显示文件名'
    }
]
export default {
    PAGESIZE_CONFIG,
    STATUS,
    NAV_LIST,
    OPERATE_AUTH,
    NAV_LIST_SOFTWARE,
    OPERATELIST
}
