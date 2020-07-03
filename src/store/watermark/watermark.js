import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    watermarkList: [],
    currentWatermark: '',
    fontFamily: '',
    fontSize: '',
    displayPosition: '',
    displayMode: ''
}

const getters = {
    getWatermarkList: state => state.watermarkList,
    getCurrentWatermark: state => (state.currentWatermark ? state.currentWatermark : null),
    getFontFamily: state => state.fontFamily,
    getFontSize: state => state.fontSize,
    getDisplayPosition: state => state.displayPosition,
    getDisplayMode: state => state.displayMode
}
const actions = {
    getWatermarkList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('watermarkList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setWatermarkList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    createWatermark: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('watermark'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    saveWatermark: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('watermark'), params.id), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    deleteWatermark: ({ dispatch }, id) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.UrlConcat(api.getUrl('watermark'), id))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getFontFamily: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('fontFamily'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setFontFamily', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getFontSize: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('fontSize'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setFontSize', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getDisplayPosition: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('displayPosition'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setDisplayPosition', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getDisplayMode: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('displayMode'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setDisplayMode', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setWatermarkList(state, data) {
        state.watermarkList = data
    },
    setFontFamily(state, data) {
        state.fontFamily = data
    },
    setFontSize(state, data) {
        state.fontSize = data
    },
    setDisplayPosition(state, data) {
        state.displayPosition = data
    },
    setDisplayMode(state, data) {
        state.displayMode = data
    },
    setCurrentWatermark(state, data) {
        state.currentWatermark = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
