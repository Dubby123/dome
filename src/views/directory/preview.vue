<template
    ><el-container class="main_body preview" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-main class="main_table">
            <el-container class="table_box">
                <el-header class="table_header">
                    <span class="file_name">{{ fileName }}</span>
                    <div class="table_btns">
                        <el-button type="primary" icon="el-icon-share" @click="copyFileUrl" plain class="tag-file-links" :data-clipboard-text="fileUrl">
                            分享
                        </el-button>
                    </div>
                </el-header>
                <div class="info_file">上传时间：{{ updateTime }}</div>
                <el-main class="table_content">
                    <div v-if="imageType.indexOf(fileType) !== -1" class="imgType"><img id="imgType" src="" /></div>
                    <embed id="pdfType" src="" v-else-if="pdfType.indexOf(fileType) !== -1" type="application/pdf" width="100%" height="100%" />
                    <img id="zipType" src="../../assets/img/zip.png" v-else-if="fileType === 'zip' || fileType === 'rar'" />
                    <div class="full_screen_button" v-if="pdfType.indexOf(fileType) !== -1" title="全屏显示" @click="fullScreenShow">
                        <img src="../../assets/img/full.png" />
                    </div>
                </el-main>
            </el-container>
        </el-main>
        <transition name="draw">
            <div class="right" v-show="boxshow">
                <div><b>推荐指数</b><el-rate v-model="value" disabled text-color="#ff9900" style="display:inline" disabled-void-color="#dcdcdc"> </el-rate></div>
                <ul class="content-comment" v-if="commentList.length !== 0">
                    <li v-for="item in commentList" :key="item.id">
                        <div>
                            <div>
                                <el-avatar shape="square" :src="item.avatarSrc" key="55555"></el-avatar>
                            </div>
                            <div>{{ item.personName }}</div>
                        </div>
                        <div>
                            <div class="comment-box">
                                <div class="border"></div>
                                {{ item.contentView }}
                            </div>
                            <div class="time-box">{{ item.createTime }}</div>
                        </div>
                    </li>
                </ul>
                <div v-else class="no-comment"><div>暂无评论</div></div>
                <el-pagination @current-change="handleCurrentChange" :current-page="current" :page-sizes="pageSize" :page-size="size" layout="prev, pager, next" :total="total">
                </el-pagination>
                <div class="new-comment">
                    <div class="top">
                        <b>评论</b>
                        <el-button type="text" @click="submitComment">
                            提交
                        </el-button>
                    </div>
                    <div class="bottom">
                        <el-input placeholder="留下你的评论吧" type="textarea" v-model="comment"></el-input>
                    </div>
                </div></div
        ></transition>
        <div class="zhankai_button">
            <el-button type="text" @click="boxshow = !boxshow">
                {{ boxshow ? '隐藏评论区' : '展开评论区' }}
            </el-button>
        </div>
        <div id="phone_pdf" v-if="!this.isPc()" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.2)">
            <pdf :src="phonePdfSrc" v-for="i in numPages" :key="i" :page="i"></pdf>
        </div>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message } from 'element-ui'
import pdf from 'vue-pdf'
import Clipboard from 'clipboard'
// import axios from 'axios'
// import api from '@/common/api'
export default {
    name: 'preview',
    components: { pdf },
    data() {
        return {
            value: 0,
            comment: '',
            pageSize: Const.PAGESIZE_CONFIG.normal,
            fileType: 'pdf',
            avatarSrc: '',
            imageType: ['jpg', 'jpeg', 'png', 'bmp', 'gif'], //图片的文件格式
            pdfType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'], //预览pdf格式文件类型
            fid: '',
            fileName: '',
            updateTime: '',
            pdfSrc: '',
            fullscreenLoading: false,
            phonePdfSrc: '',
            numPages: 0,
            fileUrl: '',
            boxshow: false
        }
    },
    computed: {
        ...mapState('preview', ['size', 'current', 'total']),
        ...mapGetters('preview', {
            commentList: 'getCommentList',
            currentFile: 'getCurrentFile'
        }),
        ...mapGetters('directory', {
            directoryFileList: 'getDirectoryFileList',
            directoryAuthList: 'getDirectoryAuthList',
            directoryTree: 'getDirectoryTree',
            currentDirectoryNode: 'getCurrentDirectoryNode'
        })
    },
    mounted() {
        if (this.isPc()) {
            if (this.$route.query.id) {
                this.fid = this.$route.query.id
                this.getFileInfoById(this.$route.query.id)
            } else {
                this.fileName = this.currentFile.fileName
                this.updateTime = this.currentFile.updateTime
                this.value = this.currentFile.recommendGrade
                this.fileType = this.currentFile.fileExtName
                this.fid = this.currentFile.id
                this.previewFile()
            }
            this.getCommentList()
        } else {
            this.phonePreviewPdfInit()
        }
    },
    watch: {},
    methods: {
        //判断是电脑端还是移动端
        isPc() {
            {
                var userAgentInfo = navigator.userAgent
                var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
                var flag = true
                for (var v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        flag = false
                        break
                    }
                }
                return flag
            }
        },
        //通过文件的id查询文件的信息
        getFileInfoById(id) {
            let params = {
                fid: id
            }
            this.$store.dispatch('preview/getFileInfoById', params).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.fileType = res.data.fileExtName
                    if (res.data.gradeCount && res.data.gradeCount !== '0') {
                        this.value = Number(res.data.grade) / Number(res.data.gradeCount)
                    } else {
                        this.value = 0
                    }
                    this.fileName = res.data.fileName
                    this.updateTime = res.data.updateTime
                    if (res.data.canPreview) {
                        this.previewFile()
                    } else {
                        Message.warning({
                            message: '很抱歉，您还没有预览的权限！',
                            showClose: true
                        })
                    }
                })
            })
        },
        //评论分页查询
        getCommentList() {
            let params = {
                current: this.current || 1,
                size: this.size || 10,
                fid: this.fid
            }
            this.$store.dispatch('preview/getCommentList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //提交评论
        submitComment() {
            if (!Utils.isString(this.comment)) {
                return Message.warning({
                    message: '请先输入你的评论',
                    showClose: true
                })
            }
            let params = {
                commonFileId: this.fid,
                content: this.comment
            }
            this.$store.dispatch('preview/addComment', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.comment = ''
                    this.getCommentList()
                })
            })
        },
        handleCurrentChange(val) {
            this.$store.commit('preview/changeCurrent', val)
            this.getCommentList()
        },
        //全屏显示pdf文件
        fullScreenShow() {
            let newWindow = window.open('_blank')
            let embed = document.createElement('embed')
            embed.type = 'application/pdf'
            embed.src = this.pdfSrc
            embed.style.width = '100%'
            embed.style.height = '100%'
            let embedStr = embed.outerHTML
            let str = "<!DOCTYPE html><html style='height:100%'><head><meta charset='utf-8'/><title>pdf预览</title></head><body style='height:100%'>" + embedStr + '</body></html>'
            newWindow.document.write(str)
        },
        //手机端预览pdf查询文件的类型
        getFileTypeById() {
            let params = {
                fid: this.fid
            }
            this.$store.dispatch('preview/getFileInfoById', params).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.fileType = res.data.fileExtName
                    if (res.data.canPreview) {
                        this.phonePreviewPdf()
                    } else {
                        Message.warning({
                            message: '很抱歉，您还没有预览的权限！',
                            showClose: true
                        })
                    }
                })
            })
        },
        //电脑端复制文件的链接
        copyFileUrl() {
            if (this.$route.query.id) {
                this.fileUrl = window.location.href
            } else {
                this.fileUrl = window.location.href + '?id=' + this.currentFile.id
            }
            let clipboard = new Clipboard('.tag-file-links')
            clipboard.on('success', () => {
                Message.success('文件分享链接已复制')
                clipboard.destroy()
            })
            clipboard.on('error', () => {
                Message.error('该浏览器不支持复制')
                clipboard.destroy()
            })
        },
        //手机端预览pdf初始化
        phonePreviewPdfInit() {
            this.phonePdfSrc = null
            this.numPages = 0
            this.fullscreenLoading = true
            document.querySelector('.navigator-container').style.display = 'none'
            document.body.parentNode.style.overflowY = 'hidden'
            var pdfNode = document.getElementById('phone_pdf')
            document.body.appendChild(pdfNode)
            pdfNode.style.position = 'fixed'
            pdfNode.style.width = '100%'
            pdfNode.style.height = '100%'
            pdfNode.style.zIndex = 2000
            pdfNode.style.background = '#fff'
            pdfNode.style.overflowY = 'auto'
            pdfNode.style.overflowX = 'hidden'
            pdfNode.style.left = 0
            pdfNode.style.top = 0
            this.fid = this.$route.query.id
            this.getFileTypeById()
        },
        //手机端预览pdf
        phonePreviewPdf() {
            let params = {
                fid: this.fid
            }
            this.$store
                .dispatch('preview/previewFile', params)
                .then(res => {
                    if (res.status === 200) {
                        let reader = new FileReader()
                        reader.readAsText(res.data, 'utf-8')
                        reader.onload = () => {
                            try {
                                let error = reader.result
                                let jsonError = JSON.parse(error)
                                Message.error(jsonError.message)
                            } catch (err) {
                                if (this.pdfType.indexOf(this.fileType) !== -1) {
                                    const content = res.data
                                    const blob = new Blob([content], { type: 'application/pdf' })
                                    this.phonePdfSrc = URL.createObjectURL(blob)
                                    this.phonePdfSrc = pdf.createLoadingTask(this.phonePdfSrc)
                                    this.phonePdfSrc.promise.then(pdf => {
                                        this.numPages = pdf.numPages
                                    })
                                    setTimeout(() => {
                                        this.fullscreenLoading = false
                                    }, 1500)
                                } else {
                                    Message.error('很抱歉，该文件格式暂不支持手机端预览')
                                }
                            }
                        }
                    }
                })
                .catch(e => {
                    this.$nextTick(() => {
                        Message.error({
                            showClose: true,
                            message: e.message
                        })
                    })
                })
        },
        //单文件预览
        previewFile() {
            let params = {
                fid: this.fid
            }
            this.fullscreenLoading = true
            this.$store
                .dispatch('preview/previewFile', params)
                .then(res => {
                    if (res.status === 200) {
                        let reader = new FileReader()
                        reader.readAsText(res.data, 'utf-8')
                        reader.onload = () => {
                            try {
                                let error = reader.result
                                let jsonError = JSON.parse(error)
                                Message.error(jsonError.message)
                                this.$nextTick(() => {
                                    this.fullscreenLoading = false
                                })
                            } catch (err) {
                                if (this.imageType.indexOf(this.fileType) !== -1) {
                                    const content = res.data
                                    const blob = new Blob([content])
                                    document.getElementById('imgType').src = URL.createObjectURL(blob)
                                    this.$nextTick(() => {
                                        this.fullscreenLoading = false
                                    })
                                } else if (this.pdfType.indexOf(this.fileType) !== -1) {
                                    const content = res.data
                                    const blob = new Blob([content], { type: 'application/pdf' })
                                    document.getElementById('pdfType').src = URL.createObjectURL(blob) + '#scrollbars=0&toolbar=0&statusbar=0&view=FitH,top'
                                    this.pdfSrc = URL.createObjectURL(blob) + '#scrollbars=0&toolbar=0&statusbar=0&view=FitH,top'
                                    this.$nextTick(() => {
                                        this.fullscreenLoading = false
                                    })
                                } else {
                                    this.$nextTick(() => {
                                        this.fullscreenLoading = false
                                    })
                                    Message.error('该文件格式不支持预览')
                                }
                            }
                        }
                    } else {
                        this.$nextTick(() => {
                            this.fullscreenLoading = false
                        })
                        Message.error({
                            showClose: true,
                            message: '读取文件失败'
                        })
                    }
                })
                .catch(e => {
                    this.$nextTick(() => {
                        Message.error({
                            showClose: true,
                            message: e.message
                        })
                        this.fullscreenLoading = false
                    })
                })
        }
    }
}
</script>
<style>
.preview .table_header {
    border-bottom: 1px solid #dcdfe6;
}
.preview .main_table {
    margin: 0;
    flex-basis: 0;
}
.preview .file_name {
    font-weight: 700;
}
.preview .info_file {
    padding: 15px;
}
.preview .right {
    height: 100%;
    width: 280px;
    padding: 20px 0px 0px 15px;
    box-sizing: border-box;
    position: relative;
}
.preview .right .el-pagination {
    padding: 0;
    text-align: left;
    background: #fff;
}
.preview .right .el-pager li {
    min-width: 23px;
}
.preview .right b {
    margin-right: 10px;
}
.preview .right .content-comment {
    height: calc(100% - 240px);
    overflow: auto;
    overflow-x: hidden;
}
.preview .right .content-comment li {
    display: flex;
    margin: 10px 0;
    font-size: 13px;
}
.preview .right .no-comment {
    height: calc(100% - 240px);
    display: flex;
}
.preview .right .no-comment div {
    margin: auto;
}
.preview .preview .main_table {
    margin: 0;
}
.preview .comment-box {
    background: #fff;
    padding: 4px;
    min-height: 50px;
    width: 204px;
    position: relative;
    box-sizing: border-box;
    margin-left: 15px;
    word-break: break-all;
}
.preview .time-box {
    text-align: right;
}
.preview .new-comment {
    background: #fff;
    height: 180px;
    width: 265px;
    position: absolute;
    bottom: 0;
}
.preview .new-comment .top {
    border-bottom: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
}
.preview .new-comment .top .el-button {
    float: right;
}
.preview .new-comment .bottom {
    padding: 10px;
    overflow: hidden;
}
.preview .el-textarea__inner {
    background-color: #eee;
    border: 0px solid #dcdfe6;
    height: 130px;
}
.comment-box .border {
    position: absolute;
    width: 0;
    height: 0;
    left: -18px;
    top: 12px;
    border: 6px solid transparent;
    border-right: 12px solid #fff;
}
.preview .table_content {
    text-align: center;
    overflow: hidden;
    position: relative;
}
.preview #pdfType {
    width: 100%;
    height: 100%;
}
.preview .imgType {
    height: 100%;
    overflow-y: scroll;
}
.preview #imgType {
    width: 80%;
}
.preview #zipType {
    width: 100px;
    padding-top: 200px;
}
.preview #otherType {
    padding-top: 200px;
}
.full_screen_button {
    position: absolute;
    right: 53px;
    top: 15px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f6f6f6;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    display: flex;
}
.full_screen_button img {
    width: 20px;
    height: 20px;
    margin: auto;
}
.preview .zhankai_button {
    width: 25px;
    display: flex;
    margin: auto;
    writing-mode: vertical-rl !important;
    -webkit-writing-mode: vertical-rl;
}
.preview .zhankai_button span {
    writing-mode: vertical-rl !important;
    line-height: 40px;
    letter-spacing: 0.3em;
}
.preview .zhankai_button .el-button {
    padding: 0;
}
.draw-enter-active,
.draw-leave-active {
    transition: width 0.1s ease !important;
}
.draw-enter,
.draw-leave-to {
    width: 0 !important;
}
</style>
