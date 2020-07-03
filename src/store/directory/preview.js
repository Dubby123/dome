import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import api from '@/common/api'
import Const from '@/common/const'
import axios from 'axios'
const state = {
    //评论分页
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    //评论列表
    commentList: [],
    currentFile: ''
}

const getters = {
    getCommentList: state => state.commentList,
    getCurrentFile: state => state.currentFile
}
const actions = {
    //预览文件
    // eslint-disable-next-line
    previewFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.UrlAddParam(api.getUrl('previewFile'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户对公共文件进行评论
    // eslint-disable-next-line
    addComment: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .post(api.getUrl('addComment'), params)
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //获取公共目录文件评论分页列表
    // eslint-disable-next-line no-unused-vars
    getCommentList: ({ commit }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('commentList'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS && res.data && commit('setCommentList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //通过文件的id查询文件的信息
    // eslint-disable-next-line no-unused-vars
    getFileInfoById: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlAddParam(api.getUrl('fileInfo'), params))
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        })
}
const mutations = {
    setCommentList(state, data) {
        data.records.forEach(item => {
            item.avatarSrc = 'http://portal.supconit.com:5010/api/avatar/get?' + item.userName
        })
        state.commentList = data.records
        state.size = data.size
        state.current = data.current
        state.total = data.total
        state.pages = data.pages
    },
    setCurrentFile(state, data) {
        state.currentFile = data
    },
    changeCurrent(state, current) {
        state.current = current
    },
    changeSize(state, size) {
        state.size = size
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
