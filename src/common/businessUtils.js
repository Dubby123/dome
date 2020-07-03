/** 业务工具类 */
import api from './api'
import { Message } from 'element-ui'
import Const from '@/common/const'
let { API } = api

//匹配按钮权限URL字符串提供
const MATCH_AUTH_HOST = '/platform'

/**
 * 获取权限匹配使用的url
 * 因为需要和微服务兼容；需要去掉微服务的前缀匹配字段
 * 即使 MATCH_AUTH_HOST 字段之前的全部字符串部分
 * @param {String} url api
 * @returns {String} 去掉微服务前缀的API
 */
function getAuthUrl(url) {
    return url.match(MATCH_AUTH_HOST) ? url.substring(url.match(MATCH_AUTH_HOST).index) : url
}

/**
 * 深拷贝对象
 * @param {Object} o 原对象
 * @returns {Object} 拷贝对象
 */
function ObjectClone(o) {
    return JSON.parse(JSON.stringify(o))
}

/**
 * 匹配导航栏数据的路由，获取页面id
 * @param {Array} navList 导航栏列表数据
 * @param {String} path 路由
 * @returns {String} 页面id
 */
function getAuthOperationId(navList, path) {
    for (let i = 0; i < navList.length; i++) {
        let e = navList[i]
        if (e.context == path) {
            return e.id
        } else if (Array.isArray(e.childList)) {
            return getAuthOperationId(e.childList, path)
        }
    }
}

/**
 * 私有方法
 * 匹配可显示权限列表数据
 * @param {Array} dataList 匹配前端权限数据列表
 * @param {Array} reviceList 接受后端可使用权限数据列表
 * @param {Object} tagVisableObj 前端展示tag按钮对象
 * @returns {Object} visableObj 前端展示tag按钮对象
 */
function MatchAuthOperate(dataList, reviceList, tagVisableObj) {
    let visableObj = {}
    reviceList.forEach(e => {
        dataList.forEach(data => {
            if (getAuthUrl(API[data.url]) == e.url && data.method == e.method && tagVisableObj.hasOwnProperty(data.tag)) {
                let _clone = JSON.parse(JSON.stringify(tagVisableObj[data.tag]))
                _clone.visible = true
                _clone.name = e.name
                visableObj[data.tag] = _clone
            }
        })
    })
    return visableObj
}
/**
 * 删除特定的tab
 * @param {String} name 需要删掉的tab的name
 * @param {Array} list 已有的tab列表
 * @returns {Array} 返回新列表
 */
function removeTab(name, list) {
    return list.filter(ele => {
        ele.name === name
        return ele.name !== name
    })
}
/**
 * 通用表单提交回调函数
 * @param {Object} res AjaxMessageObject
 * @param {Boolean} showSuccessMessage 是否展示成功提示
 * @returns {Promise}
 */
function CallbackHandler(res, showSuccessMessage) {
    return new Promise(resolve => {
        if (res.status == Const.STATUS.SUCCESS) {
            showSuccessMessage &&
                Message.success({
                    showClose: true,
                    message: res.message
                })
            resolve(res)
        } else {
            Message.error({
                showClose: true,
                message: res.message
            })
        }
    })
}
export default { getAuthOperationId, getAuthUrl, MatchAuthOperate, CallbackHandler, ObjectClone, removeTab }
