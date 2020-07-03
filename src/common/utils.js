/**
 * 工具类: 字符串工具类，对象工具类，路径工具类，数组工具类
 */

/**
 * 字符串拼接方法
 * @param String 拓展参数
 * @returns String
 */
let StringConcat = (first, ...args) => {
    args.forEach((s, i) => Object.prototype.toString.call(s).slice(8, -1) === 'String' || (args[i] = JSON.stringify(s)))
    return [first].concat(...args).join('')
}
/**
 * 判断字符串是否为空值或者是否为字符串
 * @returns Boolean
 */
let isString = str => {
    return !(str === '' || Object.prototype.toString.call(str).slice(8, -1) === 'Undefined' || Object.prototype.toString.call(str).slice(8, -1) === 'Null')
}
/**
 * 初始化赋值对象的每个属性为空字符串
 */
let ObjectInit = o => {
    for (let _prop in o) {
        o[_prop] = ''
    }
}
/**
 * 对象反射赋值
 * @param o 原对象 Object
 * @param _target 目标对象 Object
 */
let ObjectReflector = (o, _target) => {
    if (typeof o !== 'object' && typeof _target !== 'object' && Object.keys(o).length === 0) {
        return
    }
    for (let _prop in o) {
        if (typeof o[_prop] != 'function' && _target.hasOwnProperty(_prop)) {
            _target[_prop] = o[_prop]
        }
    }
}
/**
 * url路径批量增加参数
 * @param {String} url 原url
 * @param {Object} obj 需要拼接键值对
 * @returns {String} 新的url
 */
let UrlAddParam = (url, obj) => {
    url += '?'
    for (let _prop in obj) {
        isString(obj[_prop]) && (url = url + _prop + '=' + obj[_prop] + '&')
    }
    return url
}
/**
 * restful url拼接参数
 * @returns String
 */
let UrlConcat = (url, ...patch) => {
    patch.forEach(e => (url = url + '/' + e))
    return url
}

export default {
    isString,
    StringConcat,
    ObjectInit,
    ObjectReflector,
    UrlAddParam,
    UrlConcat
}
