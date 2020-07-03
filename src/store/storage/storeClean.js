import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    cleanList: [],
    cleanStrategy: [],
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
    getCleanList: state => state.cleanList,
    getCleanStrategy: state => state.cleanStrategy
}
const actions = {
    getCleanList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('cleanList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setCleanList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    cleanStorage: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('clean'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getCleanStrategy: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('cleanStrategy'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setCleanStrategy', res.data)
                    resolve(res)
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setCleanList(state, data) {
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
        state.cleanList = data.records
        state.current = data.current
        state.size = data.size
        state.total = data.total
        state.pages = data.pages
    },
    setCleanStrategy(state, data) {
        state.cleanStrategy = data
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
