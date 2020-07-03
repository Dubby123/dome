//import fetch from '@/common/fetch'
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
    //用户预览申请过的文件
    // eslint-disable-next-line
    previewFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.StringConcat(api.getUrl('applyPreviewUser'), params), { responseType: 'blob' })
                .then(res => {
                    res.status === Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    //用户下载申请过的文件
    // eslint-disable-next-line
    downloadFile: ({ dispatch }, params) =>
        new Promise((resolve, reject) => {
            axios
                .get(Utils.StringConcat(api.getUrl('applyDownloadUser'), params), { responseType: 'blob' })
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
