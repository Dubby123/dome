var validateNull = (rule, value, callback) => {
    value.trim() === '' ? callback(new Error('字符串为空')) : callback()
}
var validateNum = (rule, value, callback) => {
    if (isNaN(value)) {
        if (value) {
            callback(new Error('排序值必须为数字值'))
        }
    } else {
        if (parseInt(value) > 99999999999) {
            callback(new Error('排序值长度在11个字符之内'))
        } else {
            callback()
        }
    }
}
var validateNum100 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('不能为空'))
    } else if (!Number.isInteger(value) || value > 100 || value < 0) {
        callback(new Error('请输入0~100之间的数字值!'))
    } else {
        callback()
    }
}
var validateLevel = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('不能为空'))
    } else if (!Number.isInteger(value) || value > 2147483647 || value < 0) {
        callback(new Error('请输入0~2147483647数字值!'))
    } else {
        callback()
    }
}
var validateIp = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入API接口!'))
    }
    if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value.trim())) {
        callback(new Error('请输入正确的IP!'))
    } else {
        callback()
    }
}
var validateNumAlarm = (rule, value, callback) => {
    if (isNaN(value)) {
        if (value) {
            callback(new Error('请输入数字值'))
        }
    } else {
        if (parseInt(value) > 99999999999) {
            callback(new Error('长度在11个字符之内'))
        } else {
            callback()
        }
    }
}
var validateAddr = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入正确的访问地址'))
    }
    if (!/(\/[a-zA-Z0-9_-]+)+/g.test(value)) {
        callback(new Error('请输入正确的访问地址'))
    } else {
        callback()
    }
}
var validateTimeArray = (rule, value, callback) => {
    if (value === []) {
        callback(new Error('不能为空'))
    } else if (value.length < 2) {
        callback(new Error('开始时间和结束时间不能为空!'))
    } else {
        callback()
    }
}
export default {
    watermark: {
        code: [
            { required: true, message: '水印编码不能为空', trigger: 'blur' },
            { min: 4, max: 20, message: '编码长度在4到20个字符之内', trigger: 'blur' }
        ],
        name: [
            { required: true, message: '水印名称不能为空', trigger: 'blur' },
            { min: 4, max: 20, message: '名称长度在4到20个字符之内', trigger: 'blur' }
        ],
        content: [
            { required: true, message: '水印内容不能为空', trigger: 'blur' },
            { min: 4, max: 20, message: '内容长度在4到20个字符之内', trigger: 'blur' }
        ],
        fontFamily: [{ required: true, message: '水印字体不能为空', trigger: 'change' }],
        color: [{ required: true, message: '字体颜色不能为空', trigger: 'blur' }],
        fontSize: [{ required: true, message: '字体大小不能为空', trigger: 'blur' }],
        displayPosition: [{ required: true, message: '显示位置不能为空', trigger: 'change' }],
        displayPositionX: [{ required: true, message: 'X偏移不能为空', trigger: 'blur' }],
        displayPositionY: [{ required: true, message: 'Y偏移不能为空', trigger: 'blur' }],
        rotate: [{ required: true, message: '旋转角不能为空', trigger: 'blur' }],
        previewHeight: [{ required: true, message: '背景高度不能为空', trigger: 'blur' }],
        previewWidth: [{ required: true, message: '背景宽度不能为空', trigger: 'blur' }],
        displayMode: [{ required: true, message: '加载方式不能为空', trigger: 'blur' }],
        displaySpaceX: [{ required: true, message: '水平间距不能为空', trigger: 'blur' }],
        displaySpaceY: [{ required: true, message: '垂直间距不能为空', trigger: 'blur' }]
    },
    addStrategy: {
        name: [
            { required: true, message: '删除策略不能为空!', trigger: 'blur' },
            { min: 2, max: 20, message: '名称长度在2-20个字符之内!', trigger: 'blur' }
        ],
        code: [
            { required: true, message: '策略编码不能为空!', trigger: 'blur' },
            { min: 2, max: 20, message: '编码长度在2-20个字符之内!', trigger: 'blur' }
        ],
        storageVol: [
            { required: true, message: '存储使用量不能为空!', trigger: 'blur' },
            { validator: validateNum100, trigger: 'blur' }
        ],
        fileTypes: [{ required: true, message: '删除文件类型不能为空!', trigger: 'blur' }],
        level: [
            { required: true, message: '优先级不能为空!', trigger: 'blur' },
            { validator: validateLevel, trigger: 'blur' }
        ],
        timeRange: [{ required: true, message: '删除文件时间不能为空!', trigger: 'blur' }]
    },
    alarm: {
        name: [
            { required: true, message: '报警类型不能为空!', trigger: 'blur' },
            { min: 2, max: 20, message: '名称长度在2-20个字符之内!', trigger: 'blur' }
        ],
        code: [
            { required: true, message: '报警编码不能为空!', trigger: 'blur' },
            { min: 2, max: 20, message: '编码长度在2-20个字符之内!', trigger: 'blur' }
        ],
        // storageVolMin: [{ validator: validateMinVolNum, trigger: ['blur', 'change'] }],
        // storageVolMax: [{ validator: validateMaxVolNum, trigger: ['blur', 'change'] }],
        rate: [
            { required: true, message: '报警频率不能为空!', trigger: 'blur' },
            { validator: validateNum, trigger: 'blur' }
        ],
        alarmUserNames: [{ required: true, message: '通知人员不能为空!', trigger: 'change' }]
    },
    storage: {
        name: [
            { required: true, message: '储存名称不能为空!', trigger: 'blur' },
            { max: 20, message: '名称长度在20个字符之内!', trigger: 'blur' }
        ],
        diskSize: [{ required: true, message: '分配储存不能为空!', trigger: 'blur' }],
        ip: [
            { required: true, message: 'IP地址不能为空!', trigger: 'blur' },
            { validator: validateIp, trigger: 'blur' },
            { max: 50, message: 'IP地址长度在50个字符之内!', trigger: 'blur' }
        ],
        desc: [{ max: 200, message: '备注长度在200个字符之内', trigger: 'blur' }]
    },
    efficiencyAlarm: {
        level: [{ required: true, message: '报警等级不能为空!', trigger: 'change' }],
        latency: [
            { required: true, message: '响应时间不能为空!', trigger: 'blur' },
            { validator: validateNumAlarm, trigger: 'blur' }
        ],
        concurrencyCount: [
            { required: true, message: '并发次数不能为空!', trigger: 'blur' },
            { validator: validateNumAlarm, trigger: 'blur' }
        ],
        isError: [
            { required: true, message: '请求失败数不能为空!', trigger: 'blur' },
            { validator: validateNumAlarm, trigger: 'blur' }
        ],
        notifyPersonName: [{ required: true, message: '通知人员不能为空!', trigger: 'change' }]
    },
    interfaceRegist: {
        name: [
            { required: true, message: '接口名称不能为空！', validator: validateNull, trigger: 'blur' },
            { max: 50, message: '接口名称长度在50字符之内！', trigger: 'blur' }
        ],
        code: [
            { required: true, message: '接口编码不能为空！', validator: validateNull, trigger: 'blur' },
            { max: 20, message: '编码长度在20字符之内！', trigger: 'blur' }
        ],
        url: [
            { required: true, message: '访问地址不能为空！', validator: validateNull, trigger: 'blur' },
            { message: '请输入正确的访问地址', validator: validateAddr, trigger: 'blur' },
            { max: 50, message: '访问地址长度在50字符之内！', trigger: 'blur' }
        ],
        description: [{ max: 500, message: '备注长度在500字符之内！', trigger: 'blur' }]
    },
    userRules: {
        userName: [
            { required: true, message: '用户名称不能为空！', validator: validateNull, trigger: 'change' },
            { max: 64, message: '用户名称长度在127字符之内！', trigger: 'blur' }
        ],
        encryptType: [{ required: true, message: '加密方式不能为空！', validator: validateNull, trigger: 'change' }]
    },
    portRules: {
        interfaceName: [
            { required: true, message: '接口名称不能为空！', validator: validateNull, trigger: 'change' },
            { max: 64, message: '接口名称长度在127字符之内！', trigger: 'blur' }
        ],
        time: [{ required: true, message: '开始日期不能为空！', validator: validateTimeArray, trigger: 'blur' }],
        // endTime: [{ required: true, message: '结束日期不能为空！', validator: validateNull, trigger: 'blur' }],
        ip: [{ max: 512, message: '允许访问IP长度在512字符之内！', trigger: 'blur' }]
    }
}
