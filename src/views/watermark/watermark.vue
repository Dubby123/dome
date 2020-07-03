<template>
    <el-container class="main_body main-body-watermark">
        <AsideTree ref="watermarkTree" :tree="watermarkTree" :filter="true" :button="true" v-on:chooseNode="chooseNode" v-on:buttonEvent="buttonEvent" :listName="listName" />
        <el-container>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">样式设置</span>
                        <div class="table_btns">
                            <el-button type="primary" @click="saveWatermarkHandler('form')" v-if="editMode">
                                保存
                            </el-button>
                        </div>
                    </el-header>
                    <el-main class="table_content">
                        <div class="table-container none-pager">
                            <div class="forms-box">
                                <el-form v-if="editMode" :model="form" ref="form" :rules="rules" label-width="105px" size="small">
                                    <el-form-item label="水印名称" prop="name">
                                        <el-input v-model="form.name"></el-input>
                                    </el-form-item>
                                    <el-form-item label="水印编码" prop="code">
                                        <el-input v-model="form.code"></el-input>
                                    </el-form-item>
                                    <el-form-item label="内容" prop="content">
                                        <el-tooltip class="param-descript param-descript-form" style="left:-65px" placement="bottom-start">
                                            <div slot="content">
                                                ${name}:当前用户用户名 admin<br /><br />${date}:当前日期 2018-08-10<br /><br />${time}:当前时间 09:20:21<br /><br />${date}
                                                ${time}:当前时间点 2018-08-10 09:20:21
                                            </div>
                                            <el-button type="text"><i class="el-icon-info"></i></el-button>
                                        </el-tooltip>
                                        <el-input v-model="form.content" @change="updateWatermark"></el-input>
                                    </el-form-item>
                                    <el-form-item label="水印字体" prop="fontFamily">
                                        <el-select v-model="form.fontFamily" @change="updateWatermark">
                                            <el-option v-for="item in fontFamilyList" :label="item.desc" :value="item.code" :key="item.code"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="字体颜色" prop="color">
                                        <el-color-picker v-model="form.color" size="small" @change="updateWatermark"></el-color-picker>
                                    </el-form-item>
                                    <el-form-item label="字体大小" prop="fontSize">
                                        <el-select v-model="form.fontSize" @change="updateWatermark">
                                            <el-option v-for="item in fontSizeList" :value="item.code" :key="item.code"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="透明度" prop="transparent">
                                        <el-slider v-model="form.transparent" @change="updateWatermark"> </el-slider>
                                    </el-form-item>
                                    <el-form-item label="加载方式" prop="displayMode">
                                        <el-select v-model="form.displayMode" @change="updateWatermark">
                                            <el-option v-for="item in displayModeList" :label="item.desc" :value="item.code" :key="item.code"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <template v-if="form.displayMode === '1'">
                                        <el-form-item label="显示位置" prop="displayPosition">
                                            <el-select v-model="form.displayPosition" @change="updateWatermark">
                                                <el-option v-for="item in displayPositionList" :label="item.desc" :value="item.code" :key="item.code"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="X偏移(px)" prop="displayPositionX">
                                            <el-input-number v-model="form.displayPositionX" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="Y偏移(px)" prop="displayPositionY">
                                            <el-input-number v-model="form.displayPositionY" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                        </el-form-item>
                                    </template>
                                    <el-form-item label="旋转角(度)" prop="rotate">
                                        <el-input-number v-model="form.rotate" @change="updateWatermark" controls-position="right" :min="0" :max="45"></el-input-number>
                                    </el-form-item>
                                    <el-form-item label="背景宽度(px)" prop="previewWidth">
                                        <el-input-number v-model="form.previewWidth" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                    </el-form-item>
                                    <el-form-item label="背景高度(px)" prop="previewHeight">
                                        <el-input-number v-model="form.previewHeight" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                    </el-form-item>
                                    <template v-if="form.displayMode !== '1'">
                                        <el-form-item label="水平间距(px)" prop="displaySpaceX">
                                            <el-input-number v-model="form.displaySpaceX" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="垂直间距(px)" prop="displaySpaceY">
                                            <el-input-number v-model="form.displaySpaceY" @change="updateWatermark" controls-position="right" :min="0"></el-input-number>
                                        </el-form-item>
                                    </template>
                                </el-form>
                                <table v-else>
                                    <tr>
                                        <td>水印名称</td>
                                        <td>{{ currentWatermark && currentWatermark.name }}</td>
                                    </tr>
                                    <tr>
                                        <td>水印编码</td>
                                        <td>{{ currentWatermark && currentWatermark.code }}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>水印内容</span>
                                            <el-tooltip class="param-descript" style="left:12px" placement="bottom-start">
                                                <div slot="content">
                                                    ${name}:当前用户用户名 admin<br /><br />${date}:当前日期 2018-08-10<br /><br />${time}:当前时间 09:20:21<br /><br />${date}
                                                    ${time}:当前时间点 2018-08-10 09:20:21
                                                </div>
                                                <el-button type="text"><i class="el-icon-info"></i></el-button>
                                            </el-tooltip>
                                        </td>
                                        <td class="water_content" :title="currentWatermark && currentWatermark.content">{{ currentWatermark && currentWatermark.content }}</td>
                                    </tr>
                                    <tr>
                                        <td>水印字体</td>
                                        <td>{{ this.form.fontFamily === '1' ? '微软雅黑' : this.form.fontFamily === '2' ? '宋体' : '黑体' }}</td>
                                    </tr>
                                    <tr>
                                        <td>字体颜色</td>
                                        <td>{{ currentWatermark && currentWatermark.color }}</td>
                                    </tr>
                                    <tr>
                                        <td>字体大小</td>
                                        <td>{{ currentWatermark && currentWatermark.fontSize }}</td>
                                    </tr>
                                    <tr>
                                        <td>透明度</td>
                                        <td>{{ currentWatermark && currentWatermark.transparent }}</td>
                                    </tr>
                                    <tr>
                                        <td>加载方式</td>
                                        <td>{{ currentWatermark && currentWatermark.displayMode === '1' ? '单一' : '平铺' }}</td>
                                    </tr>
                                    <template v-if="form.displayMode === '1'">
                                        <tr>
                                            <td>显示位置</td>
                                            <td>
                                                {{
                                                    currentWatermark.displayPosition === '1'
                                                        ? '左上角'
                                                        : currentWatermark.displayPosition === '2'
                                                        ? '右上角'
                                                        : currentWatermark.displayPosition === '3'
                                                        ? '右下角'
                                                        : '左下角'
                                                }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>X偏移</td>
                                            <td>{{ currentWatermark && currentWatermark.displayPositionX }}</td>
                                        </tr>
                                        <tr>
                                            <td>Y偏移</td>
                                            <td>{{ currentWatermark && currentWatermark.displayPositionY }}</td>
                                        </tr>
                                    </template>
                                    <tr>
                                        <td>旋转角</td>
                                        <td>{{ currentWatermark && currentWatermark.rotate }}</td>
                                    </tr>
                                    <tr>
                                        <td>背景宽度</td>
                                        <td>{{ currentWatermark && currentWatermark.previewWidth }}</td>
                                    </tr>
                                    <tr>
                                        <td>背景高度</td>
                                        <td>{{ currentWatermark && currentWatermark.previewHeight }}</td>
                                    </tr>
                                    <template v-if="form.displayMode !== '1'">
                                        <tr>
                                            <td>水平间距</td>
                                            <td>{{ currentWatermark && currentWatermark.displaySpaceX }}</td>
                                        </tr>
                                        <tr>
                                            <td>垂直间距</td>
                                            <td>{{ currentWatermark && currentWatermark.displaySpaceY }}</td>
                                        </tr>
                                    </template>
                                </table>
                            </div>
                            <div class="preview-box">
                                <div class="preview-container">
                                    <div
                                        :style="{
                                            width: form.previewWidth ? form.previewWidth + 'px' : '100%',
                                            height: form.previewHeight ? form.previewHeight + 'px' : '100%',
                                            background: baseColor
                                        }"
                                    >
                                        <span ref="textSpan"></span>
                                        <div class="preview-canvas" ref="previewCanvas"></div>
                                    </div>
                                    <!-- <canvas ref="previewCanvas" class="preview-canvas" :width="form.previewWidth" :height="form.previewHeight">您的浏览器不支持 HTML5 canvas 标签。</canvas> -->
                                </div>
                                <div class="preview-info">水印预览</div>
                            </div>
                        </div></el-main
                    >
                </el-container>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import AsideTree from '../layout/aside.vue'
import { mapGetters } from 'vuex'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message, MessageBox } from 'element-ui'
import Watermark from '@/common/watermark'
export default {
    name: 'watermark',
    components: {
        AsideTree
    },
    data() {
        return {
            listName: '水印模板',
            editMode: false,
            name: '',
            baseColor: '#F2F2F2',
            currentWatermarkId: '',
            form: {
                id: '',
                name: '',
                code: '',
                content: '',
                fontFamily: '1',
                color: '#2483FF',
                fontSize: 16,
                transparent: 100,
                displayPosition: '1',
                displayPositionX: 0,
                displayPositionY: 0,
                rotate: 0,
                previewHeight: 600,
                previewWidth: 1000,
                displayMode: '2',
                displaySpaceX: 20,
                displaySpaceY: 30
            },
            defalutForm: {},
            rules: {
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
                    { min: 4, max: 200, message: '内容长度在4到200个字符之内', trigger: 'blur' }
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
            }
        }
    },
    computed: {
        ...mapGetters('watermark', {
            watermarkTree: 'getWatermarkList',
            currentWatermark: 'getCurrentWatermark',
            fontFamilyList: 'getFontFamily',
            fontSizeList: 'getFontSize',
            displayPositionList: 'getDisplayPosition',
            displayModeList: 'getDisplayMode'
        }),
        ...mapGetters('authConfig', {
            currentMenuId: 'getCurrentMenuId'
        })
    },
    mounted() {
        //this.baseColor = this.$store.state.authConfig.currentTheme.lightOrBlack === '1' ? '#2b3153' : '#F2F2F2'
        this.defalutForm = JSON.parse(JSON.stringify(this.form))
        this.searchHandler()
        this.$store.dispatch('watermark/getFontFamily').then(res => BusinessUtil.CallbackHandler(res))
        this.$store.dispatch('watermark/getFontSize').then(res => BusinessUtil.CallbackHandler(res))
        this.$store.dispatch('watermark/getDisplayPosition').then(res => BusinessUtil.CallbackHandler(res))
        this.$store.dispatch('watermark/getDisplayMode').then(res => BusinessUtil.CallbackHandler(res))
    },
    watch: {},
    methods: {
        //搜索水印列表
        searchHandler() {
            this.$store.dispatch('watermark/getWatermarkList', { name: '' }).then(res => {
                if (res.status !== Const.STATUS.SUCCESS) {
                    Message.error({
                        message: res.message,
                        showClose: true
                    })
                } else {
                    if (res.data.length > 0) {
                        let currentNode
                        if (Utils.isString(this.currentWatermark)) {
                            currentNode = res.data.filter(ele => ele.id === this.currentWatermark.id)[0]
                        } else {
                            currentNode = res.data[0]
                        }
                        this.$store.commit('watermark/setCurrentWatermark', currentNode)
                        this.currentWatermarkId = currentNode ? currentNode.id : ''
                        this.$nextTick(() => {
                            this.$refs.watermarkTree.setCurrentKey(currentNode.id)
                            Utils.ObjectReflector(this.currentWatermark, this.form)
                            this.updateWatermark()
                        })
                    }
                }
            })
        },
        //点击选择左侧水印
        chooseNode(data) {
            this.editMode = false
            this.$store.commit('watermark/setCurrentWatermark', data)
            this.currentWatermarkId = data.id
            Utils.ObjectReflector(this.currentWatermark, this.form)
            this.updateWatermark()
        },
        //更新水印
        updateWatermark() {
            let baseCans = document.createElement('canvas')
            //计算水印内容长度
            this.$refs.textSpan.style.display = 'inline'
            this.$refs.textSpan.innerText = this.form.content
            this.$refs.textSpan.style.fontSize = this.form.fontSize + 'px'
            let textLen = this.$refs.textSpan.offsetWidth,
                textHeight = this.$refs.textSpan.offsetHeight
            this.$refs.textSpan.style.display = 'none'
            let lHeight = textLen * Math.sin((this.form.rotate * Math.PI) / 180),
                sHeigh = textHeight * Math.cos((this.form.rotate * Math.PI) / 180)
            //设置画布的长宽
            if (this.form.displayMode === '1') {
                baseCans.width = textLen + parseInt(this.form.fontSize)
                baseCans.height = (this.form.rotate > 0 ? lHeight + sHeigh : textHeight) + parseInt(this.form.fontSize)
            } else {
                baseCans.width = textLen + this.form.displaySpaceX + parseInt(this.form.fontSize)
                baseCans.height = (this.form.rotate > 0 ? lHeight + parseInt(this.form.fontSize) : textHeight) + this.form.displaySpaceY
            }
            let baseCanvas = baseCans.getContext('2d')
            //设置文本的字体和大小
            baseCanvas.font = this.form.fontSize + 'px ' + (this.form.fontFamily === '1' ? '微软雅黑' : this.form.fontFamily === '2' ? '宋体' : '黑体')
            //设置填充绘画的颜色、渐变或者模式
            baseCanvas.globalAlpha = this.form.transparent ? this.form.transparent / 100 : 1
            baseCanvas.fillStyle = this.form.color
            //设置在绘制文本时使用的当前文本基线
            baseCanvas.textBaseline = 'top'
            //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
            let xPosi = this.form.rotate > 0 ? textHeight * Math.sin((this.form.rotate * Math.PI) / 180) : 0,
                yPosi = 5,
                posi = ''
            if (this.form.displayMode === '1') {
                if (this.form.displayPosition === '1') {
                    posi = this.form.displayPositionX + 'px ' + this.form.displayPositionY + 'px '
                } else if (this.form.displayPosition === '2') {
                    posi = this.form.previewWidth - textLen - this.form.displayPositionX + 'px ' + this.form.displayPositionY + 'px '
                } else if (this.form.displayPosition === '3') {
                    posi = this.form.previewWidth - textLen - this.form.displayPositionX + 'px ' + (this.form.previewHeight - textHeight - this.form.displayPositionY) + 'px '
                } else {
                    posi = this.form.displayPositionX + 'px ' + (this.form.previewHeight - textHeight - this.form.displayPositionY) + 'px '
                }
            }
            //旋转角度
            baseCanvas.rotate((this.form.rotate * Math.PI) / 180)
            //绘制文本
            baseCanvas.fillText(this.form.content, xPosi, yPosi)
            let div = this.$refs.previewCanvas
            let repeatStyle = this.form.displayMode === '1' ? 'no-repeat' : 'repeat'
            div.style.background = 'url(' + baseCans.toDataURL('image/png') + ') ' + posi + repeatStyle
        },
        //新建水印模板
        createWatermarkHandler() {
            //初始化默认值
            Utils.ObjectReflector(this.defalutForm, this.form)
            this.editMode = true
            this.updateWatermark()
        },
        //修改水印模板
        modifyWatermarkHandler() {
            if (!Utils.isString(this.currentWatermark)) {
                return Message.warning({
                    message: '请选择一个水印模板',
                    showClose: true
                })
            }
            this.editMode = true
            Utils.ObjectReflector(this.currentWatermark, this.form)
            this.dialogFormVisible = true
        },
        //保存修改水印
        saveWatermarkHandler(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                if (!Utils.isString(this.form.id)) {
                    this.$store.dispatch('watermark/createWatermark', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            this.searchHandler()
                            this.editMode = false
                        })
                    )
                } else {
                    this.$store.dispatch('watermark/saveWatermark', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            this.searchHandler()
                            this.editMode = false
                            this.updateWatermarkHtml()
                        })
                    )
                }
                this.$refs[formName].clearValidate()
            })
        },
        //实时更新全局的水印
        updateWatermarkHtml() {
            this.$store.dispatch('authConfig/getWatermark').then(res =>
                BusinessUtil.CallbackHandler(res).then(() => {
                    document.getElementById('shuiyinmuban').id = 'new_shuiyinmuban'
                    document.body.removeChild(document.getElementById('new_shuiyinmuban'))
                    Watermark.set(
                        res.data.content,
                        res.data.fontSize,
                        res.data.fontFamily,
                        res.data.color,
                        res.data.rotate,
                        res.data.transparent,
                        res.data.displaySpaceX,
                        res.data.displaySpaceY
                    )
                })
            )
        },
        //删除水印模板
        deleteWatermarkHandler() {
            !Utils.isString(this.currentWatermarkId)
                ? Message.warning({
                      message: '请选择一个水印模板',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除水印模板:' + this.currentWatermark.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          this.$store.dispatch('watermark/deleteWatermark', this.currentWatermarkId).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.$store.commit('watermark/setCurrentWatermark', '')
                                  this.currentWatermarkId = ''
                                  this.searchHandler()
                              })
                          )
                      })
                      // eslint-disable-next-line
                      .catch(e => console.log(e))
        },
        // cancelSubmit(formName) {
        //     this.$refs[formName].clearValidate()
        //     this.dialogFormVisible = false
        // },
        // handleClose() {
        //     this.cancelSubmit('form')
        // },
        //左侧树按钮点击事件
        buttonEvent(param) {
            switch (param) {
                case 'createHandler':
                    this.createWatermarkHandler()
                    break
                case 'modifyHandler':
                    this.modifyWatermarkHandler()
                    break
                case 'deleteHandler':
                    this.deleteWatermarkHandler()
                    break
            }
        }
    }
}
</script>
<style>
.main-body-watermark .table-container {
    height: calc(100% - 95px);
}
.main-body-watermark .table-container.none-pager {
    /* height: calc(100% - 60px); */
    height: 100%;
    overflow: hidden;
}
.main-body-watermark .table-container.none-btn {
    height: calc(100% - 48px);
}
.main-body-watermark .table-container .forms-box {
    width: 280px;
    height: calc(100% - 10px);
    overflow: auto;
    margin: 10px 20px 0 0;
    float: left;
}
.main-body-watermark .forms-box table {
    width: 100%;
}
.main-body-watermark .forms-box .el-form-item--small.el-form-item {
    margin-bottom: 13px;
}
.main-body-watermark .forms-box .el-form-item__label,
.main-body-watermark .forms-box table tr td:first-child {
    color: #999;
    font-size: 14px;
}
.main-body-watermark .forms-box table tr td {
    height: 42px;
    line-height: 42px;
    position: relative;
}
.main-body-watermark .forms-box table tr td:first-child {
    width: 88px;
    padding-right: 12px;
    text-align: right;
}
.main-body-watermark .forms-box table tr td:last-child {
    width: calc(100% - 110px);
    padding-left: 10px;
    font-size: 14px;
    color: #333;
}
.main-body-watermark .forms-box .el-select {
    width: 100%;
}
.main-body-watermark .forms-box .el-color-picker {
    display: inherit;
}
.main-body-watermark .forms-box .el-color-picker__trigger {
    width: 100%;
}
.main-body-watermark .forms-box .el-input-number {
    width: 100%;
    line-height: 32px;
}
.main-body-watermark .forms-box .el-input-number .el-input__inner {
    height: 32px;
    line-height: 32px;
}
.main-body-watermark .forms-box .el-input-number.is-controls-right .el-input-number__decrease,
.main-body-watermark .forms-box .el-input-number.is-controls-right .el-input-number__increase {
    height: 15px !important;
    line-height: 15px !important;
}
.main-body-watermark .table-container .preview-box {
    width: calc(100% - 330px);
    height: calc(100% - 10px);
    /* margin: 10px 0 0 0; */
    float: left;
    padding: 10px;
    box-shadow: 0 5px 6px rgba(0, 0, 0, 0.1);
}
.main-body-watermark .preview-container {
    width: 100%;
    height: calc(100% - 20px);
    overflow: auto;
}
.main-body-watermark .preview-info {
    width: 100%;
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 14px;
    font-family: '微软雅黑';
    font-size: #333333;
    /* margin: 20px 0 40px; */
    margin: 0 auto;
}
.main-body-watermark .preview-canvas {
    width: 100%;
    height: 100%;
    background-color: #f2f2f2;
}
.main-body-watermark .param-descript {
    width: 14px !important;
    position: absolute;
    left: -12px !important;
    top: 6px;
}
.main-body-watermark .param-descript-form {
    left: -82px !important;
    top: 4px;
}
.main-body-watermark .main_table {
    margin: 0;
}
.main-body-watermark .water_content {
    width: 174px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
}
</style>
