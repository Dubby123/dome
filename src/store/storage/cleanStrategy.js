import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    strategyList: [],
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
    getStrategyList: state => state.strategyList
}
const actions = {
    getStrategyList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('strategyList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('getStrategyList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    createStrategy: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('strategy'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    saveStrateg: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('strategy'), params.id), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    deleteStrategy: ({ dispatch }, id) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.UrlConcat(api.getUrl('strategy'), id))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    getStrategyList(state, data) {
        state.strategyList = data.records
        state.current = data.current
        state.size = data.size
        state.total = data.total
        state.pages = data.pages
    },
    changeSize(state, data) {
        state.size = data
    },
    changeCurrent(state, data) {
        state.current = data
    },
    changePersonCurrent(state, data) {
        state.personCurrent = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
