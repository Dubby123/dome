/**
 * 用户信息；页面权限；按钮权限；
 */
import fetch from '@/common/fetch'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import api from '@/common/api'
import Const from '@/common/const'

//HC系统菜单PID
const SYSTEM_NAV_CODE = '10003'

const state = {
    navList: [],
    tabsListSoftWare: [
        {
            showValue: '公共目录',
            name: 'directory'
        }
    ]
}

const getters = {
    getNavList: state => state.navList,
    getTabsList: state => state.tabsListSoftWare
}
const actions = {
    getAuthMenu: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('authMenu'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS && commit('setNavList', res.data)
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    // eslint-disable-next-line no-unused-vars
    getWatermark: ({ commit }) =>
        new Promise((resolve, reject) => {
            fetch
                .get(api.getUrl('getWatermark'))
                .then(res => {
                    res.status == Const.STATUS.SUCCESS
                    resolve(res)
                })
                .catch(err => reject(err))
        }),
    getAuthOperation: (store, path) => {
        let id = BusinessUtil.getAuthOperationId(store.state.navList, path)
        return new Promise((resolve, reject) => {
            fetch
                .get(Utils.UrlConcat(api.getUrl('authOperation'), id))
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}
const mutations = {
    setNavList(state, data) {
        let _matchNavList = Const.NAV_LIST
        if (!Array.isArray(data)) {
            return (state.navList = [])
        }
        //接受用户权限数据map
        let _dataMap = new Map()
        data.forEach(e => _dataMap.set(e.code, e))
        //展示导航栏map
        let _navMap = new Map()
        //匹配已存在的菜单项
        _matchNavList.forEach(e => {
            if (_dataMap.has(e.code)) {
                let _clone = JSON.parse(JSON.stringify(e)) //深拷贝
                let _temp = _dataMap.get(e.code) //后台数据
                _clone.name = _temp.name
                _clone.id = _temp.id
                _clone.pid = _temp.pid
                _navMap.set(_clone.id, _clone)
            }
        })
        //子目录分配
        for (let ele of _navMap.values()) {
            let _temp = _navMap.get(ele.pid)
            if (_temp) {
                _temp.childList ? _temp.childList.push(ele) : (_temp.childList = [ele])
            }
        }
        //提取一级目录  根据 SYSTEM_NAV_CODE
        let _navList = []
        for (let ele of _navMap.values()) {
            if (ele.pid === SYSTEM_NAV_CODE) {
                _navList.push(ele)
            }
        }
        state.navList = _navList
    },
    resetTabsList(state, newList) {
        state.tabsListSoftWare = newList
    },
    //tab切换路由切换时保存路由的参数
    setTabQuery(state, query) {
        state.tabsListSoftWare.forEach(el => {
            if (el.name === query.name) {
                el.query = query
            }
        })
    },
    //根据名称移除tab
    removeTab(state, name) {
        state.tabsListSoftWare = state.tabsListSoftWare.filter(ele => {
            return ele.name !== name
        })
    },
    addTabsList(state, tab) {
        //是否在tab列表中
        let _include = false
        state.tabsListSoftWare.forEach(e => {
            if (e.name === tab.name) {
                _include = true
                return
            }
        })
        //如果存在跳过
        if (_include) {
            return
        }
        //添加到tab列表中
        let _tab = {
            name: tab.name,
            path: tab.path
        }
        //从静态资源中找到导航名称
        Const.NAV_LIST.forEach(e => {
            if (e.context === tab.path) {
                _tab.showValue = e.name
                return
            }
        })
        state.tabsListSoftWare.push(_tab)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
