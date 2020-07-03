import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    nodeTree: [],
    storeMonitorList: [],
    //当前页
    current: 1,
    //每页显示的数据数量
    size: 10,
    //数据的总数
    total: 0,
    //总页数
    pages: 0,
    echartsData: {
        axis: [],
        totalData: [],
        useData: []
    },
    currentNode: null,
    currentSelectRow: ''
}

const getters = {
    getNodeTree: state => state.nodeTree,
    getStoreMonitorList: state => state.storeMonitorList,
    getEchartsData: state => state.echartsData,
    getCurrentNode: state => state.currentNode,
    getCurrentSelectRow: state => state.currentSelectRow
}
const actions = {
    getNodeTree: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('nodeList'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setNodeTree', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getStoreMonitorList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('storeMonitorList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setStoreMonitorList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    createNode: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('node'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    saveNode: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('node'), params.id), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    deleteNode: ({ dispatch }, id) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.UrlConcat(api.getUrl('node'), id))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    createStorage: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('storeMonitor'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    saveStorage: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('storeMonitor'), params.id), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    deleteStorage: ({ dispatch }, id) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.UrlConcat(api.getUrl('storeMonitor'), id))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getEchartsData: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('storeMonitorInfo'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setEchartsData', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setNodeTree(state, data) {
        state.nodeTree = data
    },
    setStoreMonitorList(state, data) {
        state.storeMonitorList = data
    },
    changeSize(state, data) {
        state.size = data
    },
    changeCurrent(state, data) {
        state.current = data
    },
    setEchartsData(state, data) {
        let optionData = {
            axis: [],
            totalData: [],
            useData: []
        }
        data.forEach(ele => {
            optionData.axis.push(ele.createTime)
            optionData.totalData.push(ele.totalMB / 1000000)
            optionData.useData.push(ele.useSize)
        })
        state.echartsData = optionData
    },
    setCurrentNode(state, data) {
        state.currentNode = data
    },
    setCurrentSelectRow(state, data) {
        state.currentSelectRow = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
