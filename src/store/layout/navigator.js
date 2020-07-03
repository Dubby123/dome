// import fetch from '@/common/fetch'
// import Utils from '@/common/utils'
// import Config from '@/config/api'

const state = {
    //导航栏是否收缩
    isCollapse: true
}

const getters = {}
const actions = {}
const mutations = {
    setIsCollapse(state, data) {
        state.isCollapse = data
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
