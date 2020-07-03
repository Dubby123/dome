<template
    ><el-container class="main_body preview" v-loading.fullscreen.lock="fullscreenLoading" element-loading-background="rgba(0, 0, 0, 0.2)">
        <el-main class="main_table">
            <el-container class="table_box">
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
import { Message } from 'element-ui'
export default {
    name: 'preview',
    components: {},
    data() {
        return {
            fileType: '',
            imageType: ['jpg', 'jpeg', 'png', 'bmp', 'gif'], //图片的文件格式
            pdfType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'], //预览pdf格式文件类型
            fid: '',
            fullscreenLoading: false
        }
    },
    computed: {},
    mounted() {
        let id = this.$route.query.id
        this.fileType = this.$route.query.fileType
        this.previewFile(id)
    },
    watch: {},
    methods: {
        //单文件预览
        previewFile(id) {
            this.fullscreenLoading = true
            this.$store
                .dispatch('directory/previewFileUser', id)
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
                                    this.$nextTick(() => {
                                        this.fullscreenLoading = false
                                    })
                                } else {
                                    Message.error('该文件格式不支持预览')
                                    this.$nextTick(() => {
                                        this.fullscreenLoading = false
                                    })
                                }
                            }
                        }
                    } else {
                        this.$nextTick(() => {
                            this.fullscreenLoading = false
                        })
                        Message.error({
                            showClose: true,
                            message: '获取文件失败'
                        })
                    }
                })
                .catch(() => {
                    this.$nextTick(() => {
                        this.fullscreenLoading = false
                    })
                })
        }
    }
}
</script>
<style>
.preview .main_table {
    margin: 0;
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
