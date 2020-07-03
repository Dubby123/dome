import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {
    alarmList: [],
    personList: [],
    //当前页
    current: 1,
    //每页显示的数据数量
    size: 10,
    //数据的总数
    total: 0,
    //总页数
    pages: 0,
    personCurrent: 1,
    personSize: 10,
    personTotal: 0,
    personPages: 0
}

const getters = {
    getAlarmList: state => state.alarmList,
    getPersonList: state => state.personList
}
const actions = {
    getAlarmList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('alarmList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setAlarmList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    createAlarm: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('alarmConfig'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    saveAlarm: ({ dispatch }, params) => new Promise((resolve, reject) => {
            fetch
                .put(Utils.UrlConcat(api.getUrl('alarmConfig'), params.id), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    deleteAlarm: ({ dispatch }, id) => new Promise((resolve, reject) => {
            fetch
                .delete(Utils.UrlConcat(api.getUrl('alarmConfig'), id))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getPersonList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('personList'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && res.data && commit('setPersonList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setAlarmList(state, data) {
        state.alarmList = data.records
        state.current = data.current
        state.size = data.size
        state.total = data.total
        state.pages = data.pages
    },
    setPersonList(state, data) {
        state.personList = data.records
        state.personCurrent = data.current
        state.personSize = data.size
        state.personTotal = data.total
        state.personPages = data.pages
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
