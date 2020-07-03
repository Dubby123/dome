/**
 * 登录功能；
 * 验证码相关；
 * 密码加密
 */
import fetch from '@/common/fetch'
// import Utils from '@/common/utils'
import api from '@/common/api'
import axios from 'axios'
import Const from '@/common/const'

const state = {
    token: '',
    username: '',
    authCode: '',
    id: '',
    passwordEncrypt: ''
}

const getters = {
    getToken: state => state.token,
    getUsername: state => state.username,
    getAuthCode: state => state.authCode,
    getUserId: state => state.id
}
const actions = {
    // eslint-disable-next-line
    login: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('login'), params)
                .then(res => {
                    // if(res.status == Config.status.SUCCESS){
                    //     // commit('setToken', res.data)
                    // }
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // getToken: ({ commit }) =>
    //     new Promise((resolve, reject) => {
    //         fetch
    //             .post(Utils.StringConcat(Config.getBaseUrl(), Config.getExUrl().network, Config.api.token))
    //             .then(res => {
    //                 res.status == Config.status.SUCCESS && commit('setToken', res.data)
    //                 resolve(res)
    //             })
    //             .catch(err => reject(err))
    //     }),
    getUser: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('userInfo'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && commit('setUsername', res.data.username)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // getUserId: ({ commit }) =>
    //     new Promise((resolve, reject) => {
    //         fetch
    //             .get(Utils.StringConcat(Config.getBaseUrl(), Config.getExUrl().system, Config.api.userInfo))
    //             .then(res => {
    //                 // console.log(res)
    //                 res.status == Config.status.SUCCESS && commit('setUserId', res.data.id)
    //                 resolve(res)
    //             })
    //             .catch(err => reject(err))
    //     }),
    // eslint-disable-next-line
    logout: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('logout'))
                .then(res => resolve(res))
                .catch(err => reject(err))
        }),
    //获取验证码
    getAuthCode: ({ commit }) =>
        new Promise(resolve => {
            axios
                .post(api.getUrl('authCode'), JSON.stringify({ filename: 'qrCode.jpg' }), {
                    responseType: 'arraybuffer'
                })
                .then(res => {
                    var src = 'data:image/jpg;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
                    commit('setAuthCode', src)
                    resolve()
                })
        }),
    // eslint-disable-next-line
    hasPwdAuth: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('hasPwdAuth'))
                .then(res => resolve(res))
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    hasRegistAuth: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('hasRegistAuth'))
                .then(res => resolve(res))
                .catch(err => reject(err))
        }),
    updatePass: (store, params) =>
        new Promise((resolve, reject) => {
            fetch
                .put(api.getUrl('updatePass'), params)
                .then(res => resolve(res))
                .catch(err => reject(err))
        }),
    // // eslint-disable-next-line
    // getDynamicCaptcha: ({ commit }, params) =>
    //     new Promise((resolve, reject) => {
    //         fetch
    //             .post(Utils.urlUtils.addParam(Utils.StringConcat(Config.getBaseUrl(), Config.getExUrl().network, Config.api.dynamicCaptcha), params))
    //             .then(res => {
    //                 resolve(res)
    //             })
    //             .catch(err => reject(err))
    //     }),
    // eslint-disable-next-line
    getPasswordEncrypt: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('passwordEncrypt'))
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    getPublicKey: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('publicKey'))
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
    // setThemeColor(state, data){
    //     state.themeColor = data
    // }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
