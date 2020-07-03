import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'

const state = {}

const getters = {}

const actions = {
    //检验每个分片是否存在
    // eslint-disable-next-line no-unused-vars
    fileUploadCheck: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('userFileUploadCheck'), params))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    checkFile: ({dispatch}, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('userCheckFile'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line
    mergeFile: ({commit}, params) => new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('userMergeFile'), params)
                .then(res => {
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}

const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
