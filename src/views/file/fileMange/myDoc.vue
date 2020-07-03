<template>
    <el-container class="loading_main my_doc">
        <el-header class="search_form doc_file_box">
            <el-form :inline="true" size="small" label-width="80px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="文件名">
                            <el-input v-model="fileName" placeholder="输入关键字查找" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="文件类型">
                            <el-select v-model="fileType">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in fileTypeList" :label="item" :value="item" :key="item"></el-option>
                            </el-select>
                        </el-form-item>
                        <!-- <div style="display:inline-block">
                            <el-form-item label="上传时间">
                                <el-date-picker v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" :picker-options="startDatePicker">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" :picker-options="endDatePicker">
                                </el-date-picker>
                            </el-form-item>
                        </div> -->
                    </el-col>
                    <el-col :span="2">
                        <el-button type="primary" @click="searchHandler">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-header>
        <el-main class="main_table">
            <el-container class="table_box">
                <el-header class="table_header">
                    <span class="table_title">文档列表</span>
                    <div class="table_btns">
                        <el-button type="primary" icon="el-icon-upload2" @click="uploadFile" plain>
                            上传
                        </el-button>
                        <el-button type="primary" icon="el-icon-download" @click="downloadFile" plain>
                            下载
                        </el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="renameFile" plain>
                            重命名
                        </el-button>
                        <el-button type="primary" icon="el-icon-rank" @click="openInnerDialog('move')" plain>
                            移动
                        </el-button>
                        <el-button type="primary" icon="el-icon-document" @click="openInnerDialog('copy')" plain>
                            复制
                        </el-button>
                        <el-button type="primary" icon="el-icon-share" @click="shareFile" plain>
                            分享
                        </el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="deleteFile" plain>
                            删除
                        </el-button>
                    </div>
                </el-header>

                <el-main class="table_content">
                    <el-table size="small" stripe height="100%" :data="diskFileList" @selection-change="handleSelectionChange" ref="multipleTable">
                        <el-table-column type="selection" width="50"></el-table-column>
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="fileName" label="文件名" min-width="50%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="fileExtName" label="文件类型" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="fileSize" label="文件大小" min-width="25%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="createTime" label="上传时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="status" label="文件状态" min-width="20%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column label="操作" min-width="20%" show-overflow-tooltip align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click.stop="previewFile(scope.$index)">预览</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <footer class="table_footer">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="current"
                        :page-sizes="pageSize"
                        :page-size="size"
                        layout="total, sizes, prev, pager, next, jumper, slot"
                        :total="total"
                        prev-text="上一页"
                        next-text="下一页"
                    >
                    </el-pagination>
                </footer>
            </el-container>
        </el-main>
        <el-dialog width="650px" :title="innerDialogTitle" :visible.sync="innerDialogVisible">
            <template>
                <AsideTree ref="innerFloderTree" style="height: 300px" :tree="fileListTree" :filter="false" :expandedKeys="expandedKeysTree2" v-on:chooseNode="chooseInnerNode" />
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInnerDialog">取消</el-button>
                <el-button type="primary" @click="chooseInnerDialog">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog width="650px" title="文件重命名" :visible.sync="renameDialogVisible">
            <template>
                <el-form ref="renameForm" :model="form" :rules="rules" label-width="130px">
                    <el-form-item label="文件名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelRenameDialog">取消</el-button>
                <el-button type="primary" @click="chooseRenameDialog('renameForm')">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog width="650px" title="上传文件" :visible.sync="uploadDialogVisible" class="upload_wraper" :before-close="chooseUploadDialog">
            <!-- <template>
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">文件列表</span>
                        <div class="table_btns">
                            <el-upload class="upload-box" :action="uploadTarget" :http-request="fileUpload" :show-file-list="false">
                                <el-button type="primary" plain>
                                    选择文件
                                </el-button>
                            </el-upload>
                        </div>
                    </el-header>
                    <el-main class="table_content upload_box">
                        <el-table size="small" stripe height="100%" :data="uploadList">
                            <el-table-column prop="fileName" label="文件名" min-width="50%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" min-width="25%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column label="状态" min-width="20%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <el-progress :percentage="uploadList[scope.$index].percentage" status="success" v-if="uploadList[scope.$index].status"></el-progress>
                                    <el-progress :percentage="uploadList[scope.$index].percentage" status="exception" v-else></el-progress>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-main>
                </el-container>
            </template> -->
            <upload ref="uploader" :fileExt="fileExt" v-on:smallfileupload="fileUpload" v-if="uploadVisible" :folderId="folderId"></upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="chooseUploadDialog">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog title="文件分享" :visible.sync="dialogFileShareVisible" width="650px" class="share_file_box">
            <el-form :model="shareFileForm" class="table-form" label-width="90px">
                <el-form-item class="longer shareradio" label="分享方式">
                    <el-radio v-model="shareFileForm.shareType" label="0">加密</el-radio>
                    <el-radio v-model="shareFileForm.shareType" label="1">公开</el-radio>
                    <el-radio v-model="shareFileForm.shareType" label="2">指定人员</el-radio>
                </el-form-item>
                <el-form-item label="提取密码" class="longer" v-if="shareFileForm.filePasswordVisible">
                    <el-input v-model="shareFileForm.filePassword" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="有效期" class="longer">
                    <el-select v-model="shareFileForm.validityTime" placeholder="请选择文件有效期">
                        <el-option label="1天" value="1"></el-option>
                        <el-option label="3天" value="3"></el-option>
                        <el-option label="7天" value="7"></el-option>
                        <el-option label="永久有效" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="longer shareradio" label="允许下载">
                    <el-radio v-model="shareFileForm.allowDownload" label="1">是</el-radio>
                    <el-radio v-model="shareFileForm.allowDownload" label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="指定人员" class="longer" v-if="shareFileForm.shareType === '2'">
                    <el-input v-model="shareFileForm.appointedPersonName" autocomplete="off" suffix-icon="el-icon-search" v-on:click.native="appointedPerson"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFileShareVisible = false">取消</el-button>
                <el-button type="primary" @click="createShareLinks">生成链接</el-button>
            </div>
        </el-dialog>
        <el-dialog title="文件分享" :visible.sync="dialogCopyAddressVisible" width="650px">
            <div class="share_box">
                <div class="share_box_icon"><i class="el-icon-success"></i></div>
                <div v-if="shareFileForm.filePasswordVisible">
                    <div class="share_box_title">分享链接已生成</div>
                    <div class="share_box_content">点击复制链接及提取码分享给其他用户</div>
                </div>
                <div v-else>
                    <div class="share_box_title">分享链接已生成</div>
                    <div class="share_box_content">点击复制链接分享给其他用户</div>
                </div>
            </div>
            <el-form class="table-form" label-width="90px">
                <el-form-item label="链接分享" class="longer">
                    <el-input v-model="shareFileForm.accessAddress" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="提取码" class="longer" v-if="shareFileForm.filePasswordVisible">
                    <el-input v-model="shareFileForm.filePassword" autocomplete="off" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyAddress" :data-clipboard-text="copyContent" class="tag-read" v-if="shareFileForm.filePasswordVisible"
                    >复制链接及提取码</el-button
                >
                <el-button type="primary" @click="copyAddress" :data-clipboard-text="copyContent" class="tag-read" v-else>复制链接</el-button>
            </div>
        </el-dialog>
        <el-dialog width="750px" title="选择文件分享人员" :visible.sync="dialogPeopleSelectVisible">
            <template>
                <el-form :inline="true" class="search_form employee" size="small" label-width="80px">
                    <el-row>
                        <el-col :span="21">
                            <el-form-item label="部门名称">
                                <el-input v-model="departmentName" placeholder="输入关键字查找" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="人员名称">
                                <el-input v-model="personName" placeholder="输入关键字查找" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="3">
                            <el-button type="primary" @click="searchUserList">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-container class="dialog_content">
                    <AsideTree class="employee" ref="dialogTree" :tree="departmentListUser" :filter="false" v-on:chooseNode="chooseInnerTreeNode" />
                    <el-main class="table_box">
                        <el-main class="table_content">
                            <el-table size="small" stripe height="100%" :data="userList" ref="multipleTableUser" @selection-change="handleInnerSelectionChange">
                                <el-table-column type="selection" width="65"></el-table-column>
                                <el-table-column type="index" width="50" label="序号"></el-table-column>
                                <el-table-column prop="username" label="用户名" min-width="30%" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="personName" label="人员名称" min-width="40%" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </el-main>
                        <el-pagination
                            @current-change="handleCurrentChangeUser"
                            :current-page="userCurrent"
                            :page-sizes="pageSize"
                            :page-size="sizeUser"
                            layout="prev, pager, next"
                            :total="currentTotal"
                        >
                        </el-pagination>
                    </el-main>
                </el-container>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPeopleSelectVisible = false">取消</el-button>
                <el-button type="primary" @click="submitChoosePersonHandler">确认</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import Clipboard from 'clipboard'
import { mapState, mapGetters } from 'vuex'
import Utils from '@/common/utils'
import AsideTree from '../../layout/aside.vue'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import api from '@/common/api'
import { Message, MessageBox } from 'element-ui'
import { Loading } from 'element-ui'
import upload from '@/components/commonUpload.vue'
const ACCEPT_CONFIG = {
    image: ['.png', '.jar', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb', '.mkv', '.jar', '.wmv', '.flv'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.jar'],
    file: ['.zip', '.rar', '.jar'],
    getAll: function() {
        return [...this.image, ...this.video, ...this.document, ...this.file]
    }
}
export default {
    name: 'fileMange_myDoc',
    components: { AsideTree, upload },
    props: {
        folderId: String,
        expandedKeysTree2: Array
    },
    data() {
        return {
            uploadList: [],
            fileExt: ACCEPT_CONFIG.getAll(),
            uploadTarget: api.getUrl('fileUploadUser'),
            uploadDialogVisible: false,
            uploadVisible: false,
            renameDialogVisible: false,
            dialogPeopleSelectVisible: false,
            innerDialogVisible: false,
            dialogFileShareVisible: false,
            dialogCopyAddressVisible: false,
            innerDialogTitle: '',
            pageSize: Const.PAGESIZE_CONFIG.normal,
            fileName: '',
            fileType: '',
            startTime: '',
            endTime: '',
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate(),
            imageType: ['jpg', 'jpeg', 'png', 'bmp', 'gif'], //图片的文件格式
            pdfType: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'], //预览pdf格式文件类型
            fileTypeList: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'rtf', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'dat', 'exe', 'z'],
            multipleSelection: [],
            innerCurrentFloderNode: '',
            form: {
                name: ''
            },
            shareFileForm: {
                //文件分享表单
                shareType: '', //分享方式
                validityTime: '', //有效期
                allowDownload: '', //是否允许下载
                appointedPerson: '', //指定接收人员id
                appointedPersonName: '', //指定接收人员名称
                filePasswordVisible: false, //提取密码框
                filePassword: '', //提取密码
                accessAddress: '' //文件访问地址
            },
            copyContent: '',
            departmentName: '',
            personName: '',
            departmentListUser: [],
            multipleSelectionUser: [],
            departmentId: '',
            rules: {
                name: [
                    { required: true, message: '文件名称不能为空', trigger: 'blur' },
                    { max: 50, message: '文件名称长度在50个字符之内', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapState('fileManagement', ['current', 'size', 'total', 'pages', 'diskFileList']),
        ...mapState('fileManagement', ['userCurrent', 'sizeUser', 'currentTotal', 'pagesUser']),
        ...mapGetters('fileManagement', {
            diskFileList: 'getDiskFileList',
            userList: 'getUserList',
            fileListTree: 'getFileTree'
        }),
        ...mapState('fileManagement', ['userCurrent', 'sizeUser', 'currentTotal', 'pagesUser'])
    },
    mounted() {
        this.searchHandler()
    },
    watch: {},
    methods: {
        //获取网盘文件分页列表
        searchHandler() {
            if (this.folderId === '0') {
                this.folderId = ''
            }
            let params = {
                rnd: Math.random() * new Date().getTime(),
                name: this.fileName || '',
                beginTime: !this.beginTime ? '' : this.beginTime,
                endTime: !this.endTime ? '' : this.endTime,
                current: this.current || 1,
                size: this.size || 10,
                type: this.fileType || '',
                categoryId: this.folderId || ''
            }
            this.$store.dispatch('fileManagement/getDiskFileList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //预览文件
        previewFile(index) {
            let loading = Loading.service({
                fullscreen: true,
                background: 'rgba(0, 0, 0, 0.2)'
            })
            let previewFile = this.diskFileList[index]
            let fid = previewFile.id
            this.$store.dispatch('fileManagement/previewFile', { fid: fid }).then(res => {
                if (res.status === 200) {
                    let reader = new FileReader()
                    reader.readAsText(res.data, 'utf-8')
                    reader.onload = () => {
                        try {
                            let error = reader.result
                            let jsonError = JSON.parse(error)
                            Message.error(jsonError.message)
                            loading.close()
                        } catch (err) {
                            if (this.imageType.indexOf(previewFile.fileExtName) !== -1) {
                                let newWindow = window.open('')
                                let img = document.createElement('img')
                                const blob = new Blob([res.data])
                                img.src = URL.createObjectURL(blob)
                                //img.style.width = '80%'
                                let imgStr = img.outerHTML
                                let str = "<!doctype><html><head><meta charset='utf-8'/><title>图片预览</title></head><body>" + imgStr + '</body></html>'
                                newWindow.document.write(str)
                                newWindow.document.body.style.textAlign = 'center'
                                loading.close()
                            } else if (this.pdfType.indexOf(previewFile.fileExtName) !== -1) {
                                const content = res.data
                                const blob = new Blob([content], { type: 'application/pdf;charset=utf-8' })
                                let newWindow = window.open('_blank')
                                let embed = document.createElement('embed')
                                embed.type = 'application/pdf'
                                embed.src = window.URL.createObjectURL(blob)
                                embed.style.width = '100%'
                                embed.style.height = '100%'
                                let embedStr = embed.outerHTML
                                let str =
                                    "<!DOCTYPE html><html style='height:100%'><head><meta charset='utf-8'/><title>pdf</title></head><body style='height:100%'>" +
                                    embedStr +
                                    '</body></html>'
                                newWindow.document.write(str)
                                loading.close()
                            } else {
                                Message.error('该文件格式不支持预览')
                                loading.close()
                            }
                        }
                    }
                } else {
                    Message.error('预览失败')
                    loading.close()
                }
            })
        },
        //打开选择人员的弹出框
        appointedPerson() {
            this.$store.dispatch('fileManagement/getDepartmentTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.departmentListUser = res.data
                        this.dialogPeopleSelectVisible = true
                        this.searchUserList()
                    }
                })
            })
        },
        //文件分享生成链接
        createShareLinks() {
            let shareFileIds = []
            this.multipleSelection.forEach(function(value) {
                shareFileIds.push(value.id)
            })
            let params = {
                shareMode: this.shareFileForm.shareType,
                shareTimeType: this.shareFileForm.validityTime,
                allowOriginalFile: this.shareFileForm.allowDownload,
                userIds: this.shareFileForm.appointedPerson || '',
                fids: shareFileIds.join()
            }
            this.$store.dispatch('fileManagement/shareFileUser', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(res => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.shareFileForm.filePasswordVisible = false
                        let strUrl = window.location.href
                        let start = strUrl.indexOf('#') //获得字符串的开始位置
                        let result = strUrl.substring(0, start + 1) //截取字符串
                        this.shareFileForm.accessAddress = Utils.StringConcat(result, '/file/fileShare?id=', res.data.shortUrl)
                        this.shareFileForm.filePassword = res.data.secretKey
                        this.dialogFileShareVisible = false
                        if (res.data.shareMode === '0') {
                            this.copyContent = '分享链接:' + this.shareFileForm.accessAddress + '    提取密码:' + this.shareFileForm.filePassword
                            this.shareFileForm.filePasswordVisible = true
                        } else {
                            this.copyContent = this.shareFileForm.accessAddress
                        }
                        this.dialogCopyAddressVisible = true
                    }
                })
            })
        },
        //复制分享链接地址
        copyAddress() {
            var clipboard = new Clipboard('.tag-read')
            clipboard.on('success', () => {
                Message.success('复制成功')
                clipboard.destroy()
                this.dialogCopyAddressVisible = false
            })
            clipboard.on('error', () => {
                Message.error('该浏览器不支持复制')
                clipboard.destroy()
            })
        },
        //上传文件
        fileUpload(file) {
            let formData = new FormData()
            formData.set('filename', file.file.name) //传其他参数
            formData.set('categoryId', this.folderId || '') //传其他参数
            formData.append('file', file.file) //传文件
            // let loading = Loading.service({
            //     target: 'loading_main',
            //     background: 'rgba(0, 0, 0, 0.2)'
            // })
            this.$store.dispatch('fileManagement/uploadFile', formData).then(res => {
                if (res.data.status === Const.STATUS.SUCCESS) {
                    this.$refs.uploader.statusSet(file.id, 'success')
                    // loading.close()
                } else {
                    // loading.close()
                    this.$refs.uploader.statusSet(file.id, 'failed')
                    Message.error({
                        showClose: true,
                        message: res.data.message
                    })
                }
            })
        },
        //上传确认
        chooseUploadDialog() {
            this.uploadVisible = false
            this.uploadDialogVisible = false
            // this.uploadList = []
            this.searchHandler()
        },
        //打开上传文件弹框
        uploadFile() {
            if (this.folderId === '') {
                return Message.warning({
                    message: '根目录不可上传文件',
                    showClose: true
                })
            }
            this.uploadVisible = true
            this.uploadDialogVisible = true
        },
        //打开移动，复制，上传弹出框
        openInnerDialog(event) {
            this.$store.dispatch('fileManagement/getFileTree')
            this.innerCurrentFloderNode = ''
            if (event === 'move') {
                if (this.multipleSelection.length > 0) {
                    this.innerDialogTitle = '移动至'
                    this.innerDialogVisible = true
                } else {
                    return Message.warning({
                        message: '请选择需要移动的文件',
                        showClose: true
                    })
                }
            } else if (event === 'copy') {
                if (this.multipleSelection.length > 0) {
                    this.innerDialogTitle = '复制至'
                    this.innerDialogVisible = true
                } else {
                    return Message.warning({
                        message: '请选择需要复制的文件',
                        showClose: true
                    })
                }
            }
        },
        //弹出框选择文件夹
        chooseInnerNode(val) {
            this.innerCurrentFloderNode = JSON.parse(JSON.stringify(val))
        },
        //取消重命名
        cancelRenameDialog() {
            this.renameDialogVisible = false
        },
        //文件重命名
        chooseRenameDialog(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                let params = {
                    filename: this.form.name,
                    id: this.multipleSelection[0].id
                }
                this.$store.dispatch('fileManagement/renameFileUser', params).then(res =>
                    BusinessUtil.CallbackHandler(res, true).then(() => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.renameDialogVisible = false
                            this.searchHandler()
                        }
                    })
                )

                this.$refs[formName].clearValidate()
            })
        },
        //文件分享
        shareFile() {
            if (this.multipleSelection.length === 0) {
                return Message.warning({
                    message: '请选择需要分享的文件',
                    showClose: true
                })
            }
            Utils.ObjectInit(this.shareFileForm)
            this.dialogFileShareVisible = true
        },
        //重命名文件
        renameFile() {
            if (this.multipleSelection.length === 0) {
                return Message.warning({
                    message: '请选择需要重命名的文件',
                    showClose: true
                })
            } else if (this.multipleSelection.length > 1) {
                return Message.warning({
                    message: '对不起,每次只能重命名一个文件',
                    showClose: true
                })
            } else {
                this.form.name = this.multipleSelection[0].fileName
                this.renameDialogVisible = true
            }
        },
        //移动文件
        moveFile() {
            let moveFileIds = []
            this.multipleSelection.forEach(function(value) {
                moveFileIds.push(value.id)
            })
            let params = {
                categoryId: this.innerCurrentFloderNode.id,
                fids: moveFileIds.join()
            }
            this.$store.dispatch('fileManagement/moveFileUser', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.innerCurrentFloderNode = ''
                    this.innerDialogVisible = false
                    this.searchHandler()
                })
            })
        },
        //复制文件
        copyFile() {
            let copyFileIds = []
            this.multipleSelection.forEach(function(value) {
                copyFileIds.push(value.id)
            })
            let params = {
                categoryId: this.innerCurrentFloderNode.id,
                fids: copyFileIds.join()
            }
            this.$store.dispatch('fileManagement/copyFileUser', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.innerCurrentFloderNode = ''
                    this.innerDialogVisible = false
                    this.searchHandler()
                })
            })
        },
        //弹出框确认选择文件夹
        chooseInnerDialog() {
            if (this.innerCurrentFloderNode) {
                switch (this.innerDialogTitle) {
                    case '移动至':
                        this.moveFile()
                        break
                    case '复制至':
                        this.copyFile()
                        break
                }
            } else {
                return Message.warning({
                    message: '请选择文件夹',
                    showClose: true
                })
            }
        },
        //弹出框取消选择文件夹
        cancelInnerDialog() {
            this.innerCurrentFloderNode = ''
            this.innerDialogVisible = false
        },
        //文件列表文件选择
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //重置文件列表分页当前页
        _resetCurrentPage() {
            this.$store.commit('fileManagement/changeCurrent', 1)
        },
        //下载文件
        downloadFile() {
            if (this.multipleSelection.length === 0) {
                return Message.warning({
                    message: '请选择需要下载的文件',
                    showClose: true
                })
            }
            let downloadIds = []
            this.multipleSelection.forEach(function(value) {
                downloadIds.push(value.id)
            })
            let firstName = this.multipleSelection[0].fileName
            if (firstName.indexOf('.') === -1) {
                firstName = firstName + '.' + this.multipleSelection[0].fileExtName
            } else {
                var index = firstName.lastIndexOf('.')
                var ext = firstName.substring(index + 1, firstName.length)
                if (ext !== this.multipleSelection[0].fileExtName) {
                    firstName = firstName + '.' + this.multipleSelection[0].fileExtName
                }
            }
            this.$store.dispatch('fileManagement/downloadFile', { fids: downloadIds.join() }).then(res => {
                if (res.status === 200) {
                    let reader = new FileReader()
                    reader.readAsText(res.data, 'utf-8')
                    reader.onload = () => {
                        try {
                            let error = reader.result
                            let jsonError = JSON.parse(error)
                            Message.error(jsonError.message)
                        } catch (err) {
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
                        }
                    }
                } else {
                    Message.error({
                        showClose: true,
                        message: '下载失败'
                    })
                }
            })
            this.multipleSelection = []
            this.$refs.multipleTable.clearSelection()
        },
        //删除文件
        deleteFile() {
            let deleteFileName
            if (this.multipleSelection.length > 0) {
                this.multipleSelection.length === 1 ? (deleteFileName = this.multipleSelection[0].fileName) : (deleteFileName = this.multipleSelection[0].fileName + '等')
            }
            this.multipleSelection.length === 0
                ? Message.warning({
                      message: '请选择需要删除的文件',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除文件:' + deleteFileName + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          let deleteFileIds = []
                          this.multipleSelection.forEach(function(value) {
                              deleteFileIds.push(value.id)
                          })
                          let params = { fids: deleteFileIds.join() }
                          this.$store.dispatch('fileManagement/deleteFileUser', params).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.searchHandler()
                              })
                          )
                      })
                      .catch(e => console.log(e))
        },
        //人员选择弹出框点击左侧树
        chooseInnerTreeNode(val) {
            this.departmentId = val.id
            this.searchUserList()
            this.departmentId = ''
        },
        //弹出框选择人员
        handleInnerSelectionChange(val) {
            this.multipleSelectionUser = val
        },
        //文件列表分页栏列表显示条数改变
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('fileManagement/changeSize', size)
            this.searchHandler()
        },
        //文件列表分页栏页码改变
        handleCurrentChange(current) {
            this._resetCurrentPage()
            this.$store.commit('fileManagement/changeCurrent', current)
            this.searchHandler()
        },
        //弹出框取消
        cancelDistributeSubmit() {
            this.dialogDistributeVisible = false
        },
        //弹出框选择人员
        submitChoosePersonHandler() {
            let userId = []
            let userName = []
            this.multipleSelectionUser.forEach(item => {
                userId.push(item.id)
                userName.push(item.personName)
            })
            this.dialogPeopleSelectVisible = false
            this.shareFileForm.appointedPerson = userId.join()
            this.shareFileForm.appointedPersonName = userName.join()
            this.multipleSelectionUser = []
            this.$refs.multipleTableUser.clearSelection()
        },
        //弹出框人员选择切换分页
        handleCurrentChangeUser(userCurrent) {
            this.$store.commit('fileManagement/changeUserCurrent', userCurrent)
            this.searchUserList()
        },
        //弹出框获取人员列表
        searchUserList() {
            let params = {
                current: this.userCurrent || 1,
                size: this.sizeUser || 10,
                personName: this.personName || '',
                departmentId: this.departmentId || ''
            }
            this.$store.dispatch('fileManagement/getUserList', params)
        },
        //设置开始时间不可选择日期
        beginDate() {
            return {
                disabledDate: time => {
                    let endDateVal = this.endTime
                    if (endDateVal) {
                        return time.getTime() > new Date(endDateVal).getTime()
                    }
                }
            }
        },
        //设置结束时间不可选择日期
        processDate() {
            return {
                disabledDate: time => {
                    let beginDateVal = this.startTime
                    if (beginDateVal) {
                        return time.getTime() < new Date(beginDateVal).getTime() - 8.64e6
                    }
                }
            }
        }
    }
}
</script>
<style scopedSlots>
.doc_file_box .el-date-editor.el-input {
    width: auto;
}
.upload_box {
    height: 200px;
}
.share_file_box .el-select {
    width: 80%;
}
.share_box {
    display: flex;
    padding: 20px;
}
.share_box_icon {
    margin-right: 20px;
}
.share_box_icon i {
    font-size: 40px;
    color: #67c23a;
    margin-top: 10px;
}
.share_box .share_box_title {
    color: #000;
    font-weight: 700;
}
.el-icon-circle-close {
    cursor: pointer;
}
.el-progress-bar {
    width: 85%;
}
.upload_wraper .el-table--scrollable-y .el-table__body-wrapper {
    height: 162px !important;
}
</style>
