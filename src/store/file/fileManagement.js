import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'
import axios from 'axios'
const state = {
    //我的网盘文件分页
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    //我的分享文件分页
    currentShare: 1,
    sizeShare: 10,
    totalShare: 0,
    pagesShare: 0,
    //我的网盘文件列表
    diskFileList: [],
    //我的分享文件列表
    shareFileList: [],
    userList: [],
    fileListTree: [],
    //人员查询列表分页
    sizeUser: 10,
    userCurrent: 1,
    currentTotal: 0,
    pagesUser: 0,
    currentFloder: '',
    parentFloderName: '',
    treeType: 'myspace', //文档中心当前的树类型
    currentDirectory: '' //当前缓存的文档中心公共目录数据
}

const getters = {
    getDiskFileList: state => state.diskFileList,
    getShareFileList: state => state.shareFileList,
    getUserList: state => state.userList,
    getFileTree: state => state.fileListTree,
    getCurrentFloder: state => state.currentFloder,
    getParentFloderName: state => state.parentFloderName,
    getTreeType: state => state.treeType,
    getCurrentDirectory: state => state.currentDirectory
}
const actions = {
    //获取网盘文件分页列表
    getDiskFileList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('fileList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setDiskFileList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取我的分享文件分页列表
    getShareFileList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('shareList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setShareFileList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户预览自己文件
    // eslint-disable-next-line
    getFilePreview: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('filePreview'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户下载自己文件
    // eslint-disable-next-line
    downloadFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('fileDownloadUser'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //修改文件名
    // eslint-disable-next-line
    renameFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlAddParam(Utils.StringConcat(api.getUrl('renameFile'), params.id), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户删除文件
    // eslint-disable-next-line
    deleteFileUser: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('deleteFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户删除文件夹
    // eslint-disable-next-line
    deleteFolderUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .delete(Utils.StringConcat(api.getUrl('deleteFolder'), params.id))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户修改文件夹
    // eslint-disable-next-line
    editFolderUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(Utils.StringConcat(api.getUrl('editFolder'), params.id), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户上传文件
    // eslint-disable-next-line
    uploadFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('fileUploadUser'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户分享文件
    // eslint-disable-next-line
    shareFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('shareFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户新建文件夹
    // eslint-disable-next-line
    newFolderUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('newFolder'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //移动文件所在文件夹
    // eslint-disable-next-line
    moveFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(api.getUrl('moveFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //复制文件到另一目录
    // eslint-disable-next-line
    copyFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(api.getUrl('copyFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取文档结构树
    // eslint-disable-next-line
    getFileTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('fileTree'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setFileTree', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取上传文件系统配置
    // eslint-disable-next-line
    getUploadFileSize: ({ dispatch }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('uploadFileSize'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //上传文件
    // eslint-disable-next-line
    uploadFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .post(api.getUrl('fileUploadUser'), params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //下载文件
    // eslint-disable-next-line
    downloadFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .post(api.getUrl('fileDownloadUser'), params, { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //预览文件
    // eslint-disable-next-line
    previewFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.UrlAddParam(api.getUrl('filePreview'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取用户分页列表
    getUserList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('personList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && commit('setUserList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //部门查询部门列表
    // eslint-disable-next-line
    getDepartmentTree: ({ dispatch }) => 
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('departmentMessageTree'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setDiskFileList(state, data) {
        data.records.forEach(item => {
            if (item.fileSize < 0.1 * 1024) {
                //小于0.1KB，则转化成B
                item.fileSize = item.fileSize.toFixed(2) + 'B'
            } else if (item.fileSize < 0.1 * 1024 * 1024) {
                //小于0.1MB，则转化成KB
                item.fileSize = (item.fileSize / 1024).toFixed(2) + 'KB'
            } else if (item.fileSize < 0.1 * 1024 * 1024 * 1024) {
                //小于0.1GB，则转化成MB
                item.fileSize = (item.fileSize / (1024 * 1024)).toFixed(2) + 'MB'
            } else {
                //其他转化成GB
                item.fileSize = (item.fileSize / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
            }
        })
        state.diskFileList = data.records
        state.size = data.size
        state.current = data.current
        state.total = data.total
        state.pages = data.pages
    },
    setShareFileList(state, data) {
        state.shareFileList = data.records
        state.sizeShare = data.size
        state.currentShare = data.current
        state.totalShare = data.total
        state.pagesShare = data.pages
    },
    setUserList(state, data) {
        state.userList = data.records
        state.sizeUser = data.size
        state.userCurrent = data.current
        state.currentTotal = data.total
        state.pagesUser = data.pages
    },
    setCurrentFloder(state, data) {
        state.currentFloder = data
    },
    setParentFloderName(state, data) {
        state.parentFloderName = data
    },
    setFileTree(state, data) {
        let fileTreeArray = [
            {
                children: [],
                id: '0',
                name: '我的空间',
                pid: ''
            }
        ]
        fileTreeArray[0].children = data
        state.fileListTree = fileTreeArray
    },
    changeCurrent(state, current) {
        state.current = current
    },
    changeCurrentShare(state, currentShare) {
        state.currentShare = currentShare
    },
    changeSize(state, size) {
        state.size = size
    },
    changeSizeShare(state, sizeShare) {
        state.sizeShare = sizeShare
    },
    changeSizeUser(state, sizeUser) {
        state.sizeUser = sizeUser
    },
    changeUserCurrent(state, userCurrent) {
        state.userCurrent = userCurrent
    },
    changeTreeType(state, type) {
        state.treeType = type
    },
    setCurrentDirectory(state, data) {
        state.currentDirectory = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
