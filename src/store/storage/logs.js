import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    logList: [],
    logTypeList: [],
    //当前页
    current: 1,
    //每页显示的数据数量
    size: 10,
    //数据的总数
    total: 0,
    //总页数
    pages: 0
}

const getters = {
    getLogList: state => state.logList,
    getLogTypeList: state => state.logTypeList
}
const actions = {
    getLogList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('logList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setLogList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getLogTypeList: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('logType'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setLogTypeList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setLogList(state, data) {
        state.logList = data.records
        state.current = data.current
        state.size = data.size
        state.total = data.total
        state.pages = data.pages
    },
    setLogTypeList(state, data) {
        state.logTypeList = data
    },
    changeSize(state, data) {
        state.size = data
    },
    changeCurrent(state, data) {
        state.current = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
