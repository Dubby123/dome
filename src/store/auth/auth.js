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
    directoryAuthList: [], //用户操作的按钮权限
    authGroupsList: [], //权限列表数据
    roleTree: [],
    positionTree: []
}
const getters = {
    getDirectoryFileList: state => state.directoryFileList,
    getDirectoryAuthList: state => state.directoryAuthList,
    getCurrentDirectoryNode: state => state.currentDirectoryNode,
    getAuthGroupsList: state => state.authGroupsList,
    getRoleTree: state => state.roleTree,
    getPositionTree: state => state.positionTree
}
const actions = {
    //获取文档结构树
    // eslint-disable-next-line
    getDirectoryTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('directoryTree'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取部门的结构树
    // eslint-disable-next-line
    getPositionTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('getPosition'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setPositionTree', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取角色树
    // eslint-disable-next-line
    getRoleTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('getRole'))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setRoleTree', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取当前用户给指定目录设置的部门角色权限
    // eslint-disable-next-line no-unused-vars
    getAuthGroups: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('getAuthGroups'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setAuthGroupsList', res.data)
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
    //新增操作权限
    // eslint-disable-next-line no-unused-vars
    addOperate: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('addOperate'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //修改操作权限
    // eslint-disable-next-line no-unused-vars
    editOperate: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(Utils.StringConcat(api.getUrl('editOperate'), params.id), params)
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
    //删除权限
    // eslint-disable-next-line
    deleteOperate: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .delete(api.getUrl('deleteOperate'), params)
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
    setAuthGroupsList(state, data) {
        data.forEach(item => {
            if (item.groupType === '2') {
                item.authType = '角色权限'
            } else if (item.groupType === '1') {
                item.authType = '部门权限'
            }
            item.operateList = []
            item.operateNameList = []
            item.operateIdList.forEach(el => {
                item.operateList.push(Const.OPERATELIST[el])
                item.operateNameList.push(Const.OPERATELIST[el].value)
            })
            item.type = 'get'
            item.edit = false
            // item.operateNameList = item.operateNameList.join()
        })
        state.authGroupsList = data
    },
    addAuthGroupsList(state, data) {
        state.authGroupsList.push(data)
    },
    setDirectoryAuth(state, data) {
        state.directoryAuthList = data
    },
    setCurrentDirectoryNode(state, data) {
        state.currentDirectoryNode = data
    },
    setRoleTree(state, data) {
        state.roleTree = data
    },
    setPositionTree(state, data) {
        state.positionTree = data
    },
    changeCurrent(state, current) {
        state.current = current
    },
    changeSize(state, size) {
        state.size = size
    },
    setDirectoryTree(state, data) {
        let setTree = list => {
            if (!Utils.isString(list)) {
                return
            }
            list.forEach((el, index) => {
                el.isEdit = false
                if (Utils.isString(el.children) && el.children.length > 0) {
                    setTree(list[index].children)
                }
            })
        }
        setTree(data)
        state.directoryTree = data
    },
    addDirectoryNode(state, id) {
        let newChild = { id: new Date().getTime(), name: '', children: [], isEdit: true }
        let addNode = list => {
            if (!Utils.isString(list)) {
                return
            }
            list.forEach((el, index) => {
                if (el.id === id) {
                    let newChildArray = el.children.slice()
                    el.children = null
                    el.children = newChildArray.push(newChild)
                    return
                    //Vue.set(el, 'children', newChildArray)
                }
                if (Utils.isString(el.children) && el.children.length > 0) {
                    addNode(list[index].children)
                }
            })
        }
        addNode(state.directoryTree)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
