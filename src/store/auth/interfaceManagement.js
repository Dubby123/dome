import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    //用户接口分页
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    //用户接口分页列表数据
    userInterfaceList: [],
    currentInterface: ''
}

const getters = {
    getInterfaceList: state => state.userInterfaceList,
    getCurrentInterface: state => state.currentInterface
}
const actions = {
    //获取用户接口分页列表
    getInterfaceList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('userInterfaceList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setInterfaceList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //新增用户接口
    // eslint-disable-next-line
    newUserInterface: ({ dispatch },params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('newInterface'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //删除用户接口
    // eslint-disable-next-line
    deleteUserInterface: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.StringConcat(api.getUrl('deleteInterface'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //刷新指定用户的appSecert
    // eslint-disable-next-line
    refreshUserAppsecret: ({ dispatch },params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlAddParam(api.getUrl('refreshAppsecret'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //修改用户
    // eslint-disable-next-line
    editUserAppsecret: ({ dispatch },params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('editInterface'), params.userId), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
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
    setInterfaceList(state, data) {
        data.records.forEach(item => {
            item.uploadBeginTime && item.uploadEndTime ? (item.allowUploadTime = item.uploadBeginTime + '~' + item.uploadEndTime) : (item.allowUploadTime = '——')
            item.deleteBeginTime && item.deleteEndTime ? (item.allowdeleteTime = item.deleteBeginTime + '~' + item.deleteEndTime) : (item.allowdeleteTime = '——')
            item.downloadBeginTime && item.downloadEndTime ? (item.allowDownloadTime = item.downloadBeginTime + '~' + item.downloadEndTime) : (item.allowDownloadTime = '——')
        })
        state.userInterfaceList = data.records
        state.size = data.size
        state.current = data.current
        state.total = data.total
        state.pages = data.pages
    },
    changeSize(state, size) {
        state.size = size
    },
    setCurrentInterface(state, data) {
        state.currentInterface = data
    },
    changeCurrent(state, current) {
        state.current = current
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
