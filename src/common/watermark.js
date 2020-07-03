let watermark = {}

let setWatermark = (str, fontSize, fontFamily, color, rotate, transparent, displaySpaceX, displaySpaceY) => {
    let id = 'shuiyinmuban'

    if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
    }
    //创建一个画布
    let can = document.createElement('canvas')
    //创建标签span用于获取水印内容的宽高
    let textSpan = document.createElement('span')
    textSpan.innerText = str
    textSpan.style.fontSize = fontSize + 'px'
    document.body.appendChild(textSpan)
    let textLen = textSpan.offsetWidth,
        textHeight = textSpan.offsetHeight
    textSpan.style.display = 'none'
    let lHeight = textLen * Math.sin((rotate * Math.PI) / 180)
    // sHeigh = textHeight * Math.cos((rotate * Math.PI) / 180)
    can.width = textLen + displaySpaceX + parseInt(fontSize)
    can.height = (rotate > 0 ? lHeight + parseInt(fontSize) : textHeight) + displaySpaceY
    let cans = can.getContext('2d')
    //旋转角度
    cans.rotate((rotate * Math.PI) / 180)
    cans.font = fontSize + 'px' + ' ' + (fontFamily === '1' ? '微软雅黑' : fontFamily === '2' ? '宋体' : '黑体')
    //设置填充绘画的颜色、渐变或者模式
    cans.fillStyle = color
    cans.globalAlpha = (transparent / 100).toFixed(2)
    //设置文本内容的当前对齐方式
    cans.textAlign = 'left'
    //设置在绘制文本时使用的当前文本基线
    cans.textBaseline = 'top'
    //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
    let xPosi = rotate > 0 ? textHeight * Math.sin((rotate * Math.PI) / 180) : 0,
        yPosi = 5
    cans.fillText(str, xPosi, yPosi)

    let div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '30px'
    div.style.left = '0px'
    div.style.position = 'fixed'
    div.style.zIndex = '10'
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    document.body.appendChild(div)
    return div
}

// 该方法只允许调用一次,全局唯一的id
watermark.set = (str, fontSize, fontFamily, color, rotate, transparent, displaySpaceX, displaySpaceY) => {
    setWatermark(str, fontSize, fontFamily, color, rotate, transparent, displaySpaceX, displaySpaceY)
    // setInterval(() => {
    //     if (document.getElementById(id) === null) {
    //         id = setWatermark(str, fontSize, fontFamily, color, rotate, transparent, displaySpaceX, displaySpaceY)
    //     }
    // }, 500)
    window.onresize = () => {
        setWatermark(str, fontSize, fontFamily, color, rotate, transparent, displaySpaceX, displaySpaceY)
    }
}

export default watermark
