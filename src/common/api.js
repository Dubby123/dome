/**
 * API配置
 */
import Utils from './utils'

//后台地址端口
var baseUrl = ''
//后台微服务 项目前缀
var exUrl = {}
//软件工厂项目地址
var generatorUrl = ''
//退出登录后重定向的地址
var logoutUrl = ''
/**
 * API静态对象
 * 根据微服务前缀名+对应API组合
 * 结合baseUrl，使用get方法获取
 */
const API = {
    //hc-accesscontrol -------------------------------------------------------------------------------------------
    login: '/hc-accesscontrol/platform/login',
    logout: '/hc-accesscontrol/platform/security/logout',
    authMenu: '/hc-accesscontrol/platform/security/menu',
    authOperation: '/hc-accesscontrol/platform/security/operate',
    token: '/hc-accesscontrol/platform/security/token',
    authCode: '/hc-accesscontrol/platform/security/captcha',
    hasPwdAuth: '/hc-accesscontrol/platform/security/login-functions/retrieve-password',
    passwordEncrypt: '/hc-accesscontrol/platform/security/login-functions/password-encrypt',
    publicKey: '/hc-accesscontrol/platform/security/login-functions/encrypt-public-key',
    hasRegistAuth: '/hc-accesscontrol/platform/security/login-functions/online-register',
    registCode: '/hc-accesscontrol/platform/security/login-functions/online-register-code',
    authentication: '/hc-accesscontrol/platform/security/login-functions/retrieve-password-authentication',
    pwdCode: '/hc-accesscontrol/platform/security/login-functions/retrieve-password-code',
    renewalPwd: '/hc-accesscontrol/platform/security/login-functions/retrieve-password-renewal',
    dynamicCaptcha: '/hc-accesscontrol/platform/security/login-functions/dynamic-captcha',
    registAuth: '/hc-accesscontrol/platform/security/login-functions/online-register-authentication',
    register: '/hc-accesscontrol/platform/security/login-functions/online-register-user',

    userInfo: '/hc-system/platform/organization/user/info',
    updatePass: '/hc-system/platform/organization/user-setting/modifyPassword',

    //hc-websocket -------------------------------------------------------------------------------------------
    websocket: '/hc-websocket/platform/websocket',
    departmentMessageTree: '/hc-websocket/platform/system/message/department/tree', //消息部门查询
    userMessageTree: '/hc-websocket/platform/system/message/user/list', //用户查询
    userMessageTreeDepartment: '/hc-websocket/platform/system/message/department/tree/all', //用户查询时的部门列表

    //hc-filedfs   -------------------------------------------------------------------------------------------
    //file
    fileList: '/hc-filedfs/platform/file/disk/home/list', //网盘文件分页列表
    filePreview: '/hc-filedfs/platform/file/disk/home/preview', //用户预览自己文件
    fileUploadUser: '/hc-filedfs/platform/file/disk/home/upload', //用户上传文件
    fileDownloadUser: '/hc-filedfs/platform/file/disk/home/download', //用户下载文件
    deleteFile: '/hc-filedfs/platform/file/disk/home/delete', //删除文件信息
    renameFile: '/hc-filedfs/platform/file/disk/home/rename/', //重命名文件
    fileTree: '/hc-filedfs/platform/file/userfile/category/tree', //获取文档结构树
    moveFile: '/hc-filedfs/platform/file/disk/home/move', //移动文件所在文件夹
    copyFile: '/hc-filedfs/platform/file/disk/home/copy', //复制文件到另一目录
    shareFile: '/hc-filedfs/platform/file/share', //文件分享
    shareList: '/hc-filedfs/platform/file/share/manage', //我的分享文件列表
    newFolder: '/hc-filedfs/platform/file/userfile/category', //用户新建文件夹
    deleteFolder: '/hc-filedfs/platform/file/userfile/category/', //删除文件夹
    editFolder: '/hc-filedfs/platform/file/userfile/category/', //修改文件夹
    getShare: '/hc-filedfs/platform/file/opt/s/', //获取文件分享地址
    downloadShare: '/hc-filedfs/platform/file/opt/download', //下载分享文件
    previewShare: '/hc-filedfs/platform/file/opt/preview', //预览分享文件
    previewShareList: '/hc-filedfs/platform/file/opt/s', //分享文件列表
    savePreviewShare: '/hc-filedfs/platform/file/opt/saveTo', //保存分享文件
    uploadFileSize: '/hc-filedfs/platform/file/disk/home/uploadFileSize', //获得系统文件上传配置
    //file-storeManage
    alarmList: '/hc-filedfs/platform/file/alarmconfig/list',
    alarmConfig: '/hc-filedfs/platform/file/alarmconfig',
    personList: '/hc-filedfs/platform/file/user/list',
    strategyList: '/hc-filedfs/platform/file/cleanstrategy/list',
    strategy: '/hc-filedfs/platform/file/cleanstrategy',
    logType: '/hc-filedfs/platform/file/systemlog/logType',
    logList: '/hc-filedfs/platform/file/systemlog/list',
    clean: '/hc-filedfs/platform/file/cleanstorage/clean',
    cleanList: '/hc-filedfs/platform/file/cleanstorage/list',
    cleanStrategy: '/hc-filedfs/platform/file/cleanstorage/strategy',
    nodeList: '/hc-filedfs/platform/file/group/node/list',
    node: '/hc-filedfs/platform/file/group/node',
    storeMonitorList: '/hc-filedfs/platform/file/storage/server/list',
    storeMonitor: '/hc-filedfs/platform/file/storage/server',
    storeMonitorInfo: '/hc-filedfs/platform/file/storage/server/trend',
    //file-watermarkManage
    watermarkList: '/hc-filedfs/platform/file/watermark/list',
    watermark: '/hc-filedfs/platform/file/watermark',
    fontSize: '/hc-filedfs/platform/file/watermark/fontSzie',
    fontFamily: '/hc-filedfs/platform/file/watermark/fontFamily',
    displayMode: '/hc-filedfs/platform/file/watermark/displayMode',
    displayPosition: '/hc-filedfs/platform/file/watermark/displayPosition',
    getWatermark: '/hc-filedfs/platform/file/watermark/defaultWatermark',
    //file-interfaceManagement
    userInterfaceList: '/hc-filedfs/platform/file/userkey/list', //获取用户分页接口信息
    newInterface: '/hc-filedfs/platform/file/userkey', //新增用户接口
    deleteInterface: '/hc-filedfs/platform/file/userkey/', //删除用户
    refreshAppsecret: '/hc-filedfs/platform/file/userkey/refresh-secret', //刷新指定用户的appsecret
    editInterface: '/hc-filedfs/platform/file/userkey', //修改用户
    //directory
    directoryTree: '/hc-filedfs/platform/file/common/file/category/tree',
    directoryAuth: '/hc-filedfs/platform/file/common/category/auth/operate/auth', //获取当前用户在指定目录下的操作权限
    directoryFileList: '/hc-filedfs/platform/file/portal/getpagecommfiles', //公共目录文件分页列表查询
    grade: '/hc-filedfs/platform/file/common/file/grade', //公共目录文件评分
    applyDownload: '/hc-filedfs/platform/file/common/file/download/apply', //发起文件下载申请
    applyPreview: '/hc-filedfs/platform/file/common/file/preview/apply', //发起文件预览申请
    applyDownloadUser: '/hc-filedfs/platform/file/common/file/download/apply/download/', //用户下载申请过的文件
    applyPreviewUser: '/hc-filedfs/platform/file/common/file/preview/apply/preview/', //用户预览申请过的文件
    previewFile: '/hc-filedfs/platform/file/common/file/preview', //文件预览
    deleteDirectoryFile: '/hc-filedfs/platform/file/common/file/delete', //删除公共目录的文件
    downloadDirectoryFile: '/hc-filedfs/platform/file/common/file/download', //下载公共目录的文件
    uploadDirectoryFile: '/hc-filedfs/platform/file/common/file/upload', //上传文件到公共目录
    renameDirectoryFile: '/hc-filedfs/platform/file/common/file/rename/', //上传文件到公共目录
    moveDirectoryFile: '/hc-filedfs/platform/file/common/file/move', //移动公共目录文件
    copyDirectoryFile: '/hc-filedfs/platform/file/common/file/copy', //移动公共目录文件
    deleteDirectory: '/hc-filedfs/platform/file/common/file/category/', //删除公共目录
    addDirectory: '/hc-filedfs/platform/file/common/file/category', //新建公共目录
    editDirectory: '/hc-filedfs/platform/file/common/file/category/', //修改公共目录
    addComment: '/hc-filedfs/platform/file/common/file/comment', //用户对公共目录发表评论
    commentList: '/hc-filedfs/platform/file/common/file/comment/list', //分页查询文件评论的列表
    fileInfo: '/hc-filedfs/platform/file/common/file/info', //通过文件id查询文件的信息
    //file-upload
    fileUpload: '/hc-filedfs/platform/file/common/file/chunk/fileUpload', //分片上传
    fileUploadCheck: '/hc-filedfs/platform/file/common/file/chunk/fileUpload', //检验每个分片是否存在
    checkFile: '/hc-filedfs/platform/file/common/file/chunk/checkFile', //通过md5校验文件是否存在
    mergeFile: '/hc-filedfs/platform/file/common/file/chunk/mergeFile', //合并文件
    //file-upload-user
    userFileUpload: '/hc-filedfs/platform/file/user/file/chunk/fileUpload', //分片上传
    userFileUploadCheck: '/hc-filedfs/platform/file/user/file/chunk/fileUpload', //检验每个分片是否存在
    userCheckFile: '/hc-filedfs/platform/file/user/file/chunk/checkFile', //通过md5校验文件是否存在
    userMergeFile: '/hc-filedfs/platform/file/user/file/chunk/mergeFile', //合并文件
    //directory----auth
    getAuthGroups: '/hc-filedfs/platform/file/common/category/auth/operate/getAuthGroups', //获取当前用户在指定目录设置的部门及角色权限
    addOperate: '/hc-filedfs/platform/file/common/category/auth/operate', //新增时保存当前用户给指定目录设置的权限操作
    editOperate: '/hc-filedfs/platform/file/common/category/auth/operate/', //修改当前用户给指定目录设置的权限操作
    deleteOperate: '/hc-filedfs/platform/file/common/category/auth/operate', //删除当前用户给指定目录设置的权限操作
    getRole: '/hc-filedfs/platform/authorization/role/list', //获得角色树
    getPosition: '/hc-filedfs/platform/organization/position/list' //获得部门树
    // hc-filedfs   end-------------------------------------------------------------------------------------------
}
/**
 * 通过baseUrl.json 配置后台地址
 * @param {String} host 后台地址+端口
 */
let setHost = host => (baseUrl = host)

/**
 * 通过baseUrl.json 配置微服务地址
 * @param {Object} exUrl 微服务项目前缀
 */
let setExUrl = ex => (exUrl = ex)
/**
 * 通过baseUrl.json 配置软件工程地址
 * @param {String} url 软件工厂地址
 */
let setGeneratorUrl = url => (generatorUrl = url)
/**
 * 获取软件工厂跳转地址
 * @returns {String}  url地址
 */
let getGeneratorUrl = () => generatorUrl

/**
 * 通过baseUrl.json 配置退出登录后重定向地址
 * @param {String} url 重定向地址
 */
let setLogoutUrl = url => (logoutUrl = url)
/**
 * 获取在线文档跳转地址
 * @returns {String}  url地址
 */
let getLogoutUrl = () => logoutUrl

/**
 * 获取API方法
 * 同时可以定制匹配微服务url进行替换
 * 请求后台数据时调用
 * @param {String} key api key
 * @returns {String} 需要的请求API
 */
let getUrl = key => {
    let url = API[key]
    if (!url) {
        return console.error('请求路径获取错误')
    }
    //微服务名称替换
    for (let _p in exUrl) {
        if (url.match(_p)) {
            url = url.replace(_p, exUrl[_p])
            break
        }
    }
    return Utils.StringConcat(baseUrl, url)
}

/**
 * 获取baseUrl
 * @returns {String}  url地址
 */
let getBaseUrl = () => baseUrl

/**
 * 获取微服务exUrl
 * @returns {String}  url地址
 */
let getExUrl = () => exUrl

export default {
    setHost,
    setExUrl,
    getUrl,
    API,
    setGeneratorUrl,
    getGeneratorUrl,
    getBaseUrl,
    getExUrl,
    setLogoutUrl,
    getLogoutUrl
}
