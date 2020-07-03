import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'
import axios from 'axios'
const state = {
    //公共目录文件分页
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    //公共目录文件列表
    directoryFileList: [],
    currentDirectoryNode: '', //当前选中的文件目录
    directoryTree: [],
    directoryAuthList: [], //用户操作的按钮权限
    currentNodeId: ''
}

const getters = {
    getDirectoryFileList: state => state.directoryFileList,
    getDirectoryAuthList: state => state.directoryAuthList,
    getCurrentDirectoryNode: state => state.currentDirectoryNode,
    getDirectoryTree: state => state.directoryTree,
    getCurrentNodeId: state => state.currentNodeId
}
const actions = {
    //获取公共目录文件分页列表
    getDirectoryFileList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('directoryFileList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setDirectoryFileList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取当前用户在当前目录下的操作权限
    getDirectoryAuth: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('directoryAuth'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setDirectoryAuth', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户给公共目录的文件打分
    // eslint-disable-next-line no-unused-vars
    recommendGrade: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('grade'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //发起文件下载申请
    // eslint-disable-next-line no-unused-vars
    applyDownload: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(Utils.UrlAddParam(api.getUrl('applyDownload'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //发起文件预览申请
    // eslint-disable-next-line no-unused-vars
    applyPreview: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(Utils.UrlAddParam(api.getUrl('applyPreview'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //修改文件名
    // eslint-disable-next-line
    renameDirectoryFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlAddParam(Utils.StringConcat(api.getUrl('renameDirectoryFile'), params.id), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //删除公共目录的文件
    // eslint-disable-next-line
    deleteDirectoryFile: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('deleteDirectoryFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //删除公共目录
    // eslint-disable-next-line
    deleteDirectory: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .delete(Utils.StringConcat(api.getUrl('deleteDirectory'), params.id))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //修改公共目录
    // eslint-disable-next-line
    editDirectory: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlAddParam(Utils.StringConcat(api.getUrl('editDirectory'), params.id), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户新建文件夹
    // eslint-disable-next-line
    addDirectory: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('addDirectory'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //移动文件所在目录
    // eslint-disable-next-line
    moveDirectoryFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(api.getUrl('moveDirectoryFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //复制文件到另一目录
    // eslint-disable-next-line
    copyDirectoryFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(api.getUrl('copyDirectoryFile'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取文档结构树
    // eslint-disable-next-line
    getDirectoryTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('directoryTree'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setDirectoryTree', res.data)
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
                .post(api.getUrl('uploadDirectoryFile'), params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //下载文件
    // eslint-disable-next-line
    downloadDirectoryFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .post(api.getUrl('downloadDirectoryFile'), params, { responseType: 'blob' })
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
                .get(Utils.UrlAddParam(api.getUrl('previewFile'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户预览申请过的文件
    // eslint-disable-next-line
    previewFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.StringConcat(api.getUrl('applyPreviewUser'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户下载申请过的文件
    // eslint-disable-next-line
    downloadFileUser: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.StringConcat(api.getUrl('applyDownloadUser'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户对公共文件进行评论
    // eslint-disable-next-line
    addComment: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('addComment'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取公共目录文件评论分页列表
    // eslint-disable-next-line no-unused-vars
    commentList: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('commentList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setDirectoryFileList(state, data) {
        data.records.forEach(item => {
            if (item.gradeCount === '0') {
                item.recommendGrade = 0
            } else {
                item.recommendGrade = Number(item.grade) / Number(item.gradeCount).toFixed(1)
            }
            if (Number(item.fileSize) < 0.1 * 1024) {
                //小于0.1KB，则转化成B
                item.fileSize = Number(item.fileSize).toFixed(2) + 'B'
            } else if (Number(item.fileSize) < 0.1 * 1024 * 1024) {
                //小于0.1MB，则转化成KB
                item.fileSize = (Number(item.fileSize) / 1024).toFixed(2) + 'KB'
            } else if (Number(item.fileSize) < 0.1 * 1024 * 1024 * 1024) {
                //小于0.1GB，则转化成MB
                item.fileSize = (Number(item.fileSize) / (1024 * 1024)).toFixed(2) + 'MB'
            } else {
                //其他转化成GB
                item.fileSize = (Number(item.fileSize) / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
            }
        })
        state.directoryFileList = data.records
        state.size = data.size
        state.current = data.current
        state.total = data.total
        state.pages = data.pages
    },
    setDirectoryAuth(state, data) {
        state.directoryAuthList = data
    },
    setCurrentDirectoryNode(state, data) {
        state.currentDirectoryNode = data
    },
    setCurrentNodeId(state, data) {
        state.currentNodeId = data
    },
    setDirectoryTree(state, data) {
        state.directoryTree = data
    },
    changeCurrent(state, current) {
        state.current = current
    },
    changeSize(state, size) {
        state.size = size
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
