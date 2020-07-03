<template>
    <el-container class="share">
        <el-main class="main_table share_content">
            <el-container class="table_box" v-if="!filePassword">
                <el-main class="table_content share_list">
                    <div class="title-btn-box">
                        <div class="share-name">{{ shareName }}</div>
                        <div>
                            <el-button type="primary" plain @click="saveFile" class="right-button" v-show="allowDownload === '1'">保存到我的文档</el-button>
                            <el-button type="primary" plain @click="downloadFile" class="right-button" v-show="allowDownload === '1'"
                                ><i class="el-icon-download"></i>下载</el-button
                            >
                        </div>
                    </div>
                    <div class="describe_box">
                        <span>分享时间：{{ shareTime }}</span>
                        <span class="validitytime">有效期：{{ validityTime }}</span>
                    </div>
                    <div v-if="showFileList" class="share_table">
                        <el-table size="small" stripe height="100%" :data="shareFileList" @selection-change="handleSelectionChange" ref="multipleTable">
                            <el-table-column type="selection" width="65"></el-table-column>
                            <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
                            <el-table-column prop="fileName" label="文件名" min-width="40%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="fileType" label="文件类型" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" min-width="25%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column label="操作" min-width="20%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" @click.stop="previewFile(scope.$index)">预览</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div v-else class="one-file-box">
                        <img id="imgType" src="" v-if="imageType.indexOf(shareFileType) !== -1" />
                        <embed id="pdfType" src="" v-else-if="pdfType.indexOf(shareFileType) !== -1" type="application/pdf" />
                        <img id="zipType" src="../../../assets/img/zip.png" v-else-if="shareFileType === 'zip' || shareFileType === 'rar'" />
                        <div id="otherType" v-else-if="shareFileType === 'nothingnessFile'">文件不存在</div>
                        <div id="otherType" v-else-if="!shareFileType">分享已过期</div>
                        <div id="otherType" v-else>{{ shareFileType }}文件格式不支持预览</div>
                    </div>
                    <el-dialog title="选择目标文件夹" :visible.sync="dialogTreeVisible" class="el-tree-dialog">
                        <template>
                            <AsideTree style="height: 300px" :tree="fileListTree" :filter="false" v-on:chooseNode="chooseInnerNode" />
                        </template>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="saveToFile">确定</el-button>
                            <el-button @click="dialogTreeVisible = false">取 消</el-button>
                        </div>
                    </el-dialog>
                </el-main>
            </el-container>
            <el-container v-if="filePassword">
                <el-main>
                    <el-dialog title="分享文件提取" :visible.sync="filePassword" width="28%">
                        <el-form class="table-form" label-width="90px">
                            <el-form-item label="提取码" class="longer">
                                <el-input v-model="filePasswordString" autocomplete="off" placeholder="请输入提取码"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="getFile">提取文件</el-button>
                        </div>
                    </el-dialog>
                </el-main>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
import { mapState } from 'vuex'
import AsideTree from '../../layout/aside.vue'
import Const from '@/common/const'
import { Message } from 'element-ui'
import BusinessUtil from '@/common/businessUtils'

export default {
    name: 'fileShare',
    components: { AsideTree },
    data() {
        return {
            shareName: '', //分享名称
            shareTime: '', //分享时间
            validityTime: '', //有效期
            shareFileType: '', //单文件时文件的类型
            imageType: ['jpg', 'jpeg', 'png', 'bmp', 'gif'], //图片的文件格式
            pdfType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'], //预览pdf格式文件类型
            filePassword: false, //是否需要提取码
            filePasswordString: '', //用户输入的提取码
            allowDownload: '', //是否允许下载,1允许下载
            dialogTreeVisible: false, //文件夹树弹出框是否可见
            fileListTree: [],
            multipleSelection: [],
            fileFolderId: '', //文件夹id
            fileId: '', //单文件id
            fileName: '',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            showFileList: false //是否显示分享文件的列表
        }
    },
    computed: {
        ...mapState('fileShare', ['shareFileList'])
    },
    mounted() {
        let query = {
            name: this.$route.name,
            id: this.$route.query.id
        }
        this.$store.commit('authConfig/setTabQuery', query)
        this.getShareFileList()
    },
    methods: {
        //获得分享文件列表
        getShareFileList() {
            this.filePassword = false
            let params = {
                shortUrl: this.$route.query.id,
                secretKey: ''
            }
            this.$store.dispatch('fileShare/getShareFileList', params).then(res => {
                if (res.status === Const.STATUS.SUCCESS) {
                    this.allowDownload = res.data.allowOriginalFile
                    this.shareTime = res.data.shareTime
                    this.shareName = res.data.shareName
                    this.validityTime = res.data.shareTimeTypeDesc
                    if (res.data.shareFileList.length > 1) {
                        this.showFileList = true
                    } else if (res.data.shareFileList.length === 1) {
                        this.shareFileType = res.data.shareFileList[0].fileType
                    } else if (res.data.shareFileList.length === 0) {
                        this.shareFileType = 'nothingnessFile'
                        return Message.error('文件不存在或已被删除')
                    }
                    if (!res.data.secretKey) {
                        if (res.data.shareFileList.length === 1) {
                            this.previewFileShare()
                        }
                    } else {
                        this.filePassword = true
                    }
                } else {
                    if (res.message === '请输入提取码') {
                        this.filePassword = true
                    } else {
                        Message.error({
                            showClose: true,
                            message: res.message
                        })
                    }
                }
            })
        },
        //需要提取密码时的文件提取
        getFile() {
            let params = {
                shortUrl: this.$route.query.id,
                secretKey: this.filePasswordString
            }
            this.$store.dispatch('fileShare/getShareFileList', params).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        if (res.data.shareFileList.length === 1) {
                            this.shareFileType = res.data.shareFileList[0].fileType
                            this.previewFileShare()
                        } else if (res.data.shareFileList.length > 1) {
                            this.showFileList = true
                        } else if (res.data.shareFileList.length === 0) {
                            this.shareFileType = 'nothingnessFile'
                            return Message.error('文件不存在或已被删除')
                        }
                        this.allowDownload = res.data.allowOriginalFile
                        this.shareTime = res.data.shareTime
                        this.shareName = res.data.shareName
                        this.validityTime = res.data.shareTimeTypeDesc
                        this.filePassword = false
                    }
                })
            })
        },
        //下载文件
        downloadFile() {
            if (this.multipleSelection.length === 0 && this.shareFileList.length > 1 && !this.shareFileType) {
                return Message.warning({
                    message: '请选择需要下载的文件',
                    showClose: true
                })
            }
            if (this.shareFileList.length > 1 && !this.shareFileType) {
                let downloadIds = []
                this.multipleSelection.forEach(function(value) {
                    downloadIds.push(value.id)
                })
                let firstName = this.multipleSelection[0].fileName
                this.$store
                    .dispatch('fileShare/downloadFileShare', { fids: downloadIds.join(), secretKey: this.filePasswordString }) //已修改，待验证
                    .then(res => {
                        if (res.status === 200) {
                            let a = document.createElement('a')
                            const content = res.data
                            const blob = new Blob([content])
                            a.href = URL.createObjectURL(blob)
                            if (downloadIds.length === 1) {
                                a.download = firstName
                            } else {
                                let filesName = '批量下载' + firstName + '等.zip'
                                a.download = filesName
                            }
                            a.target = '_blank'
                            a.click()
                            a.remove()
                            Message.success({
                                showClose: true,
                                message: '下载成功'
                            })
                        } else {
                            Message.error({
                                showClose: true,
                                message: '下载失败'
                            })
                        }
                    })
                this.multipleSelection = []
                this.$refs.multipleTable.clearSelection()
            } else {
                let id, name
                if (this.shareFileList.length > 1 && this.shareFileType) {
                    id = this.fileId
                    name = this.fileName
                } else {
                    id = this.shareFileList[0].id
                    name = this.shareFileList[0].fileName
                }
                this.$store
                    .dispatch('fileShare/downloadFileShare', { fids: id, secretKey: this.filePasswordString }) //增加secretKey，待验证
                    .then(res => {
                        if (res.status === 200) {
                            let a = document.createElement('a')
                            const content = res.data
                            const blob = new Blob([content])
                            a.href = URL.createObjectURL(blob)
                            a.download = name
                            a.target = '_blank'
                            a.click()
                            a.remove()
                            Message.success({
                                showClose: true,
                                message: '下载成功'
                            })
                        } else {
                            Message.error({
                                showClose: true,
                                message: '下载失败'
                            })
                        }
                    })
            }
        },
        //保存文件弹出框，请求文件夹数据
        saveFile() {
            if (this.multipleSelection.length === 0 && this.shareFileList.length > 1 && !this.shareFileType) {
                return Message.warning({
                    message: '请选择需要保存的文件',
                    showClose: true
                })
            }
            this.getFileTree()
            this.dialogTreeVisible = true
        },
        //保存文件，后台交互
        saveToFile() {
            let fids
            if (this.shareFileList.length > 1) {
                if (this.shareFileType) {
                    fids = this.fileId
                } else {
                    let saveIds = []
                    this.multipleSelection.forEach(function(value) {
                        saveIds.push(value.id)
                    })
                    fids = saveIds.join()
                }
            } else {
                fids = this.shareFileList[0].id
            }
            let params = {
                categoryId: this.fileFolderId,
                fids: fids,
                secretKey: this.filePasswordString
            }
            this.$store.dispatch('fileShare/saveFileShare', params).then(res => {
                if (res.status === Const.STATUS.SUCCESS) {
                    this.dialogTreeVisible = false
                    if (this.shareFileList.length > 1) {
                        if (!this.shareFileType) {
                            this.multipleSelection = []
                            this.$refs.multipleTable.clearSelection()
                        }
                    }
                    Message.success({
                        showClose: true,
                        message: res.message
                    })
                } else {
                    Message.error({
                        showClose: true,
                        message: res.message
                    })
                }
            })
        },
        //获取文档结构树
        getFileTree() {
            this.$store.dispatch('fileManagement/getFileTree').then(res => {
                if (res.status === Const.STATUS.SUCCESS) {
                    this.fileListTree = res.data
                } else {
                    Message.error({
                        showClose: true,
                        message: res.message
                    })
                }
            })
        },
        //点击弹出框的文档树执行
        chooseInnerNode(val) {
            this.fileFolderId = val.id
        },
        //点击分享文件列表预览文件
        previewFile(index) {
            this.showFileList = false
            this.shareFileType = this.shareFileList[index].fileType
            this.fileId = this.shareFileList[index].id
            this.fileName = this.shareFileList[index].fileName
            this.previewFileShare(this.fileId)
        },
        //单文件预览
        previewFileShare(fid) {
            let params = {
                fid: fid || this.shareFileList[0].id,
                secretKey: this.filePasswordString || ''
            }
            this.$store.dispatch('fileShare/previewFileShare', params).then(res => {
                if (res.status === 200) {
                    let reader = new FileReader()
                    reader.readAsText(res.data, 'utf-8')
                    reader.onload = () => {
                        try {
                            let error = reader.result
                            let jsonError = JSON.parse(error)
                            Message.error(jsonError.message)
                        } catch (err) {
                            if (this.imageType.indexOf(this.shareFileType) !== -1) {
                                const content = res.data
                                const blob = new Blob([content])
                                document.getElementById('imgType').src = URL.createObjectURL(blob)
                            } else if (this.pdfType.indexOf(this.shareFileType) !== -1) {
                                const content = res.data
                                const blob = new Blob([content], { type: 'application/pdf' })
                                document.getElementById('pdfType').src = URL.createObjectURL(blob)
                            } else {
                                Message.error('该文件格式不支持预览')
                            }
                        }
                    }
                } else {
                    Message.error({
                        showClose: true,
                        message: '获取文件失败'
                    })
                }
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        }
    }
}
</script>
<style scopedSlots>
.share {
    height: 100%;
    overflow: hidden;
}
.share_content {
    margin: 0;
}
.share_list {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.share_table {
    flex: 1;
    overflow: auto;
}
.title-btn-box {
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
}
.describe_box {
    padding: 10px;
}
.share-name {
    padding: 10px;
    font-weight: 700;
}
.file-content {
    display: flex;
    flex-direction: column;
}
.one-file-box {
    flex: 1;
    text-align: center;
}
.validitytime {
    margin-left: 50px;
}
#pdfType {
    width: 100%;
    height: 100%;
}
#imgType {
    width: 50%;
}
#zipType {
    width: 100px;
    padding-top: 200px;
}
#otherType {
    padding-top: 200px;
}
</style>
