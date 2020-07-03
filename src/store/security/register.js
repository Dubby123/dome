import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'

const state = {
    token: '',
    username: '',
    authCode: '',
    id: ''
}

const getters = {
    getToken: state => state.token,
    getUsername: state => state.username,
    getUserId: state => state.id
}
const actions = {
    // eslint-disable-next-line
    userAuthentication: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('authentication'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    registAuthentication: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('registAuth'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    getEmailCode: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(Utils.UrlAddParam(api.getUrl('pwdCode'), params))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    getRegisterEmailCode: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(Utils.UrlAddParam(api.getUrl('registCode'), params))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    renewalPassword: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('renewalPwd'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    registerUser: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('register'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setToken(state, data) {
        state.token = data
    },
    setUsername(state, data) {
        state.username = data
    },
    setAuthCode(state, data) {
        state.authCode = data
    },
    setUserId(state, data) {
        state.id = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
