<template
    ><el-container class="main_body preview" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-main class="main_table">
            <el-container class="table_box">
                <el-header class="table_header">
                    <span class="file_name">{{ fileName }}</span>
                    <div class="table_btns">
                        <el-button type="primary" icon="el-icon-download" @click="downloadFile" plain>
                            下载
                        </el-button>
                    </div>
                </el-header>
                <div class="info_file">上传时间：{{ updateTime }}</div>
                <el-main class="table_content">
                    <div v-if="imageType.indexOf(fileType) !== -1" class="imgType"><img id="imgType" src="" /></div>
                    <embed id="pdfType" src="" v-else-if="pdfType.indexOf(fileType) !== -1" type="application/pdf" />
                    <img id="zipType" src="../../assets/img/zip.png" v-else-if="fileType === 'zip' || fileType === 'rar'" />
                    <div id="otherType" v-else>{{ fileType }}暂无数据或文件格式不支持预览</div>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>
<script>
// import { mapState, mapGetters } from 'vuex'
// import Utils from '@/common/utils'
// import BusinessUtil from '@/common/businessUtils'
// import Const from '@/common/const'
// import { Message } from 'element-ui'
//import api from '@/common/api'
import { Message } from 'element-ui'
import BusinessUtil from '@/common/businessUtils'
export default {
    name: 'download',
    components: {},
    data() {
        return {
            fileType: '',
            imageType: ['jpg', 'jpeg', 'png', 'bmp', 'gif'], //图片的文件格式
            pdfType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'], //预览pdf格式文件类型
            fid: '',
            fullscreenLoading: false,
            fileName: '',
            updateTime: ''
        }
    },
    computed: {},
    mounted() {
        if (this.$route.query.fid) {
            let fid = this.$route.query.fid
            this.getFileInfo(fid)
        }
        let query = {
            name: this.$route.name,
            fid: this.$route.query.fid,
            id: this.$route.query.id
        }
        this.$store.commit('authConfig/setTabQuery', query)
    },
    watch: {},
    methods: {
        //获取文件的信息
        getFileInfo(fid) {
            let params = {
                fid: fid
            }
            this.$store.dispatch('preview/getFileInfoById', params).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    this.fileName = res.data.fileName
                    this.fileType = res.data.fileExtName
                    this.updateTime = res.data.updateTime
                    this.previewFile(fid)
                })
            })
        },
        //文件预览
        previewFile(fid) {
            let params = {
                fid: fid
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
                                // eslint-disable-next-line no-unused-vars
                                let jsonError = JSON.parse(error)
                                // Message.error(jsonError.message)
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
                                    // this.pdfSrc = URL.createObjectURL(blob) + '#scrollbars=0&toolbar=0&statusbar=0&view=FitH,top'
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
                            message: '预览文件失败'
                        })
                    }
                })
                .catch(() => {
                    this.$nextTick(() => {
                        this.fullscreenLoading = false
                    })
                })
        },
        downloadFile() {
            let id = this.$route.query.id
            this.fullscreenLoading = true
            this.$store.dispatch('directory/downloadFileUser', id).then(res => {
                if (res.status === 200) {
                    let reader = new FileReader()
                    reader.readAsText(res.data, 'utf-8')
                    reader.onload = () => {
                        try {
                            let error = reader.result
                            let jsonError = JSON.parse(error)
                            this.$nextTick(() => {
                                this.fullscreenLoading = false
                            })
                            Message.error(jsonError.message)
                        } catch (err) {
                            let a = document.createElement('a')
                            const content = res.data
                            const blob = new Blob([content])
                            a.href = URL.createObjectURL(blob)
                            a.download = this.fileName
                            a.target = '_blank'
                            a.click()
                            a.remove()
                            Message.success({
                                showClose: true,
                                message: '下载成功'
                            })
                            this.$nextTick(() => {
                                this.fullscreenLoading = false
                            })
                        }
                    }
                } else {
                    this.$nextTick(() => {
                        this.fullscreenLoading = false
                    })
                    Message.error({
                        showClose: true,
                        message: '下载文件失败'
                    })
                }
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
}
.preview .file_name {
    font-weight: 700;
}
.preview .info_file {
    padding: 15px;
}
.preview .preview .main_table {
    margin: 0;
}
.preview .table_content {
    text-align: center;
    overflow: hidden;
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
</style>
