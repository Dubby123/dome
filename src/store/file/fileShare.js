import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'
import axios from 'axios'
const state = {
    //分享文件列表
    shareFileList: []
}

const getters = {
    getShareFileList: state => state.shareFileList
}
const actions = {
    //获取分享文件分页列表
    getShareFileList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(Utils.UrlConcat(api.getUrl('previewShareList'), params.shortUrl), { secretKey: params.secretKey }))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setShareFileList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户预览分享的文件
    // eslint-disable-next-line
    getSharePreview: ({ dispatch },params) => new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('previewShare'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户保存分享的文件
    // eslint-disable-next-line
    saveFileShare: ({ dispatch },params) => new Promise((resolve, reject) => {
            fetch
                .post(Utils.UrlAddParam(api.getUrl('savePreviewShare'), params), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户下载分享的文件
    // eslint-disable-next-line
    downloadFileShare: ({ dispatch },params) => new Promise((resolve, reject) => {
            axios
                .post(Utils.UrlAddParam(api.getUrl('downloadShare'), params), params, {
                    responseType: 'blob'
                })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户预览分享的文件
    // eslint-disable-next-line
    previewFileShare: ({ dispatch },params) => new Promise((resolve, reject) => {
            axios
                .get(Utils.UrlAddParam(api.getUrl('previewShare'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setShareFileList(state, data) {
        state.shareFileList = data.shareFileList
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
