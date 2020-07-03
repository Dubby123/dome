<template
    ><el-container class="main_body directory">
        <AsideTree
            ref="directoryTree"
            :tree="directoryTree"
            :filter="true"
            :button="true"
            v-on:chooseNode="chooseNode"
            v-on:buttonEvent="buttonEvent"
            :expandedKeys="expandedKeys"
            v-on:onBlur="onEditBlur"
            :directoryAuthList="directoryAuthList"
        />
        <el-container>
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
                            <el-button type="primary" icon="el-icon-upload2" @click="uploadFile" plain v-if="directoryAuthList.indexOf(1) !== -1">
                                上传
                            </el-button>
                            <el-button type="primary" icon="el-icon-download" @click="downloadFile" plain v-if="directoryAuthList.indexOf(2) !== -1">
                                下载
                            </el-button>
                            <el-button type="primary" icon="el-icon-edit" @click="renameFile" plain v-if="directoryAuthList.indexOf(6) !== -1">
                                重命名
                            </el-button>
                            <el-button type="primary" icon="el-icon-rank" @click="openInnerDialog('move')" plain v-if="directoryAuthList.indexOf(3) !== -1">
                                移动
                            </el-button>
                            <el-button type="primary" icon="el-icon-document" @click="openInnerDialog('copy')" plain v-if="directoryAuthList.indexOf(4) !== -1">
                                复制
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteFile" plain v-if="directoryAuthList.indexOf(5) !== -1">
                                删除
                            </el-button>
                        </div>
                    </el-header>

                    <el-main class="table_content">
                        <el-table
                            size="small"
                            stripe
                            height="100%"
                            :data="directoryFileList"
                            @selection-change="handleSelectionChange"
                            ref="multipleTable"
                            :row-class-name="tableRowClassName"
                        >
                            <el-table-column type="selection" width="50"></el-table-column>
                            <el-table-column type="index" width="46" label="序号" align="center"></el-table-column>
                            <el-table-column label="文件名" min-width="30%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <span
                                        :class="[directoryFileList[scope.$index].canPreview ? 'cursor' : '']"
                                        @click="directoryFileList[scope.$index].canPreview && previewFile(scope.$index)"
                                        >{{ directoryFileList[scope.$index].fileName }}</span
                                    >
                                </template>
                            </el-table-column>
                            <el-table-column prop="fileExtName" label="文件类型" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="creator" label="创建人" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="updateTime" label="上传时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column label="推荐指数" min-width="30%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <el-rate v-model="directoryFileList[scope.$index].recommendGrade" disabled text-color="#ff9900" disabled-void-color="#dcdcdc"> </el-rate>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="40%" show-overflow-tooltip align="center">
                                <template slot-scope="scope">
                                    <el-button type="text" @click.stop="previewFile(scope.$index)">{{
                                        directoryFileList[scope.$index].canPreview ? '预览' : '申请预览'
                                    }}</el-button>
                                    <el-dropdown trigger="hover" @command="recommendGrade(scope.$index)" v-if="directoryAuthList.indexOf(12) !== -1">
                                        <span class="el-dropdown-link"><el-button type="text">推荐</el-button></span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item><el-rate v-model="recommendValue" show-score text-color="#ff9900"> </el-rate></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                    <el-button type="text" @click.native="applyDownload(scope.$index)" v-if="directoryAuthList.indexOf(2) === -1">申请下载</el-button>
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
                    <AsideTree
                        ref="innerDirectoryTree"
                        style="height: 300px"
                        :tree="directoryTree"
                        :filter="false"
                        v-on:chooseNode="chooseInnerNode"
                        :expandedKeys="expandedKeys"
                    />
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelInnerDialog">取消</el-button>
                    <el-button type="primary" @click="chooseInnerDialog">确认</el-button>
                </div>
            </el-dialog>
            <el-dialog width="650px" title="文件重命名" :visible.sync="renameDialogVisible">
                <template>
                    <el-form ref="renameForm" :model="form" :rules="rules" label-width="80px">
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
            <el-dialog width="650px" :title="dialogDirectoryTitle" :visible.sync="dialogDirectoryVisible">
                <template>
                    <el-form ref="directoryForm" :model="directoryForm" :rules="rules" label-width="80px">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="directoryForm.name"></el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancelDirectoryDialog">取消</el-button>
                    <el-button type="primary" @click="chooseDirectoryDialog('directoryForm')">确认</el-button>
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
                <upload ref="uploader" :fileExt="fileExt" :currentDirectory="currentDirectory" v-on:smallfileupload="fileUpload" v-if="uploadVisible"></upload>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="chooseUploadDialog">返回</el-button>
                </div>
            </el-dialog>
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Utils from '@/common/utils'
import AsideTree from '../layout/editAsideTree.vue'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import api from '@/common/api'
import { Message, MessageBox } from 'element-ui'
//import { Loading } from 'element-ui'
import upload from '@/components/upload.vue'
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
    name: 'directory',
    components: { AsideTree, upload },
    data() {
        return {
            directoryForm: {
                name: '',
                pid: '',
                id: ''
            },
            fileExt: ACCEPT_CONFIG.getAll(),
            fileTypeList: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'rtf', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'dat', 'exe', 'z'],
            recommendValue: 0,
            expandedKeys: [],
            uploadList: [],
            dialogDirectoryVisible: false,
            dialogDirectoryTitle: '',
            uploadTarget: api.getUrl('uploadDirectoryFile'),
            uploadDialogVisible: false,
            renameDialogVisible: false,
            innerDialogVisible: false,
            innerDialogTitle: '',
            pageSize: Const.PAGESIZE_CONFIG.normal,
            fileName: '',
            fileType: '',
            multipleSelection: [],
            currentDirectory: '',
            innerCurrentFloderNode: '',
            form: {
                name: ''
            },
            treeEditType: '',
            directoryTree: [],
            rules: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' },
                    { max: 50, message: '名称长度在50个字符之内', trigger: 'blur' }
                ]
            },
            initMount: true, //首次加载
            uploadVisible: false
        }
    },
    computed: {
        ...mapState('directory', ['current', 'size', 'total', 'pages']),
        ...mapGetters('directory', {
            directoryFileList: 'getDirectoryFileList',
            directoryAuthList: 'getDirectoryAuthList',
            // directoryTree: 'getDirectoryTree',
            currentNodeId: 'getCurrentNodeId',
            currentDirectoryNode: 'getCurrentDirectoryNode'
        })
    },
    mounted() {
        this._resetCurrentPage()
        this.getDirectoryTree()
    },
    watch: {},
    methods: {
        //改变行的class类名
        tableRowClassName(val) {
            if (!val.row.readed) {
                return 'weight-row'
            }
        },
        //获取公共目录结构树
        async getDirectoryTree() {
            await this.$store.dispatch('auth/getDirectoryTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (this.initMount && this.$route.query.id) {
                        //第一次加载，进入默认跳转的公共目录
                        this.$store.commit('directory/setCurrentNodeId', this.$route.query.id)
                        this.initMount = false
                    }
                    this.directoryTree = BusinessUtil.ObjectClone(res.data)
                    if (res.status === Const.STATUS.SUCCESS) {
                        if (Utils.isString(this.currentNodeId)) {
                            this.$nextTick(() => {
                                this.$refs.directoryTree.setCurrentKey(this.currentNodeId)
                                this.expandedKeys.push(this.currentNodeId)
                                this.currentDirectory = this.$refs.directoryTree.getCurrentNode()
                                this.searchHandler()
                                this.getDirectoryAuth()
                                let $this = this
                                setTimeout(function() {
                                    document.getElementById($this.currentDirectory.id).scrollIntoView(true)
                                }, 500)
                            })
                        } else {
                            this.$nextTick(() => {
                                this.$refs.directoryTree.setCurrentKey(res.data[0].id)
                                this.expandedKeys.push(res.data[0].id)
                                this.currentDirectory = this.$refs.directoryTree.getCurrentNode()
                                this.getDirectoryAuth()
                                this.searchHandler()
                            })
                        }
                    }
                })
            })
        },
        //评分
        recommendGrade(index) {
            let params = {
                commonFileId: this.directoryFileList[index].id,
                grade: String(this.recommendValue)
            }
            this.$store.dispatch('directory/recommendGrade', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.recommendValue = 0
                    this.searchHandler()
                })
            })
        },
        //申请下载
        applyDownload(index) {
            MessageBox.confirm(`确定开始申请下载文件：${this.directoryFileList[index].fileName} 的流程吗？`, '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$store.dispatch('directory/applyDownload', { fid: this.directoryFileList[index].id }).then(res => {
                        BusinessUtil.CallbackHandler(res, true)
                    })
                })
                .catch(e => console.log(e))
        },
        //左侧树点击事件
        chooseNode(data) {
            if (data.id) {
                this.currentDirectory = JSON.parse(JSON.stringify(data))
            }
            if (this.treeEditType !== 'add') {
                this._resetCurrentPage()
                this.$store.commit('directory/setCurrentNodeId', this.currentDirectory.id)
                this.getDirectoryAuth()
                this.searchHandler()
            }
        },
        //获取当前用户在指定目录被授予的全部操作权限
        getDirectoryAuth() {
            this.$store.dispatch('directory/getDirectoryAuth', { categoryId: encodeURI(this.currentDirectory.id) })
        },
        //获取公共目录文件分页列表
        searchHandler() {
            let params = {
                rnd: Math.random() * new Date().getTime(),
                name: this.fileName || '',
                current: this.current || 1,
                size: this.size || 10,
                type: this.fileType || '',
                categoryId: encodeURI(this.currentDirectory.id)
            }
            this.$store.dispatch('directory/getDirectoryFileList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //预览文件
        previewFile(index) {
            if (this.directoryFileList[index].canPreview) {
                this.$store.commit('preview/setCurrentFile', this.directoryFileList[index])
                this.$router.push({ name: 'preview', replace: true })
            } else {
                MessageBox.confirm(`确定开始申请预览文件：${this.directoryFileList[index].fileName} 的流程吗？`, '确认提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$store.dispatch('directory/applyPreview', { fid: this.directoryFileList[index].id }).then(res => {
                            BusinessUtil.CallbackHandler(res, true)
                        })
                    })
                    .catch(e => console.log(e))
            }
        },
        //上传文件
        fileUpload(file) {
            this.$refs.uploader.statusSet(file.id, 'upload')
            let formData = new FormData()
            formData.set('filename', file.file.name) //传其他参数
            formData.set('categoryId', encodeURI(this.currentDirectory.id) || '') //传其他参数
            formData.append('file', file.file) //传文件
            this.$store
                .dispatch('directory/uploadFile', formData)
                .then(res => {
                    if (res.data.status === Const.STATUS.SUCCESS) {
                        this.$refs.uploader.statusSet(file.id, 'success')
                    } else {
                        this.$refs.uploader.statusSet(file.id, 'failed')
                        Message.error({
                            showClose: true,
                            message: res.data.message
                        })
                    }
                })
                .catch(e => {
                    this.$refs.uploader.statusSet(file.id, 'failed')
                    Message.error({
                        showClose: true,
                        message: e.response.data.message
                    })
                })
        },
        //上传确认
        chooseUploadDialog() {
            this.uploadDialogVisible = false
            this.uploadList = []
            this.searchHandler()
            this.uploadVisible = false
        },
        //打开上传文件弹框
        uploadFile() {
            if (this.currentDirectory.id === '[comm]') {
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
        //弹出框选择公共目录
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
                this.$store.dispatch('directory/renameDirectoryFile', params).then(res =>
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
            this.$store.dispatch('directory/moveDirectoryFile', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.innerCurrentFloderNode = ''
                    this.$refs.innerDirectoryTree.setCurrentKey(null)
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
            this.$store.dispatch('directory/copyDirectoryFile', params).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    this.innerCurrentFloderNode = ''
                    this.$refs.innerDirectoryTree.setCurrentKey(null)
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
                    message: '请选择公共目录',
                    showClose: true
                })
            }
        },
        //弹出框取消选择公共目录
        cancelInnerDialog() {
            this.$refs.innerDirectoryTree.setCurrentKey(null)
            this.innerCurrentFloderNode = ''
            this.innerDialogVisible = false
        },
        //文件列表文件选择
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        //重置文件列表分页当前页
        _resetCurrentPage() {
            this.$store.commit('directory/changeCurrent', 1)
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
            this.$store.dispatch('directory/downloadDirectoryFile', { fids: downloadIds.join() }).then(res => {
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
                          this.$store.dispatch('directory/deleteDirectoryFile', params).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.searchHandler()
                              })
                          )
                      })
                      .catch(e => console.log(e))
        },
        //删除公共目录
        deleteHandler() {
            !Utils.isString(this.currentDirectory)
                ? Message.warning({
                      message: '请选择一个需要删除的公共目录',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除公共目录:' + this.currentDirectory.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          this.$store.dispatch('directory/deleteDirectory', { id: this.currentDirectory.id }).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.getDirectoryTree()
                                  this.$store.commit('directory/setCurrentNodeId', '')
                              })
                          )
                      })
                      .catch(e => console.log(e))
        },
        //新增或修改节点失去焦点时触发
        onEditBlur(data) {
            if (data.name) {
                if (this.treeEditType === 'add') {
                    let params = {
                        pid: this.currentDirectory.id,
                        name: data.name
                    }
                    this.$store.dispatch('directory/addDirectory', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.getDirectoryTree()
                                this.treeEditType = ''
                            }
                        })
                    )
                } else if (this.treeEditType === 'edit') {
                    let params = {
                        id: encodeURI(this.currentDirectory.id || ''),
                        name: data.name
                    }
                    this.$store.dispatch('directory/editDirectory', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.treeEditType = ''
                            }
                        })
                    )
                }
            } else {
                this.getDirectoryTree()
            }
        },
        //新增公共目录
        createHandler() {
            if (this.hasEditNode(this.directoryTree)) {
                return Message.warning({
                    message: '请先保存当前新建的目录',
                    showClose: true
                })
            }
            this.treeEditType = 'add'
            let newChild = { pid: this.currentDirectory.id, name: '', children: [], isEdit: true }
            this.currentDirectory.children.push(newChild)
            this.$set(this.$refs.directoryTree.getCurrentNode(), 'children', this.currentDirectory.children)
            this.expandedKeys.push(this.currentDirectory.id)
            this.$nextTick(() => {
                setTimeout(function() {
                    document.getElementById('edit_input').focus()
                }, 500)
            })
        },
        //判断当前是否有处于编辑状态的节点
        hasEditNode(data) {
            let editFlag = false
            let getTree = list => {
                if (!Utils.isString(list)) {
                    return
                }
                list.forEach((el, index) => {
                    if (el.isEdit) {
                        editFlag = true
                    }
                    if (Utils.isString(el.children) && el.children.length > 0) {
                        getTree(list[index].children)
                    }
                })
                return editFlag
            }
            getTree(data)
            return editFlag
        },
        //给每一项tree都增加属性,判断是否可编辑
        setDirectoryTree(data) {
            let newData = [...data]
            let setTree = list => {
                if (!Utils.isString(list)) {
                    return
                }
                list.forEach((el, index) => {
                    el.isEdit = true
                    if (Utils.isString(el.children) && el.children.length > 0) {
                        setTree(list[index].children)
                    }
                })
            }
            setTree(newData)
            return newData
        },
        //修改节点
        modifyHandler() {
            if (this.hasEditNode(this.directoryTree)) {
                return Message.warning({
                    message: '请先保存当前编辑的目录',
                    showClose: true
                })
            }
            if (!Utils.isString(this.currentDirectory)) {
                return Message.warning({
                    message: '请选择一个需要修改的目录',
                    showClose: true
                })
            }
            this.$set(this.$refs.directoryTree.getCurrentNode(), 'isEdit', true)
            this.treeEditType = 'edit'
            this.$nextTick(() => {
                document.getElementById('edit_input').focus()
            })
        },
        cancelDirectoryDialog() {
            this.dialogDirectoryVisible = false
        },
        chooseDirectoryDialog(formName) {
            this.directoryForm.pid = this.currentDirectory.id
            this.directoryForm.id = this.currentDirectory.id
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                if (this.dialogDirectoryTitle === '新增公共目录') {
                    this.$store.dispatch('directory/addDirectory', this.directoryForm).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.dialogDirectoryVisible = false
                                this.getDirectoryTree()
                            }
                        })
                    )
                } else {
                    this.$store.dispatch('directory/editDirectory', this.directoryForm).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.dialogDirectoryVisible = false
                                this.getDirectoryTree()
                            }
                        })
                    )
                }

                this.$refs[formName].clearValidate()
            })
        },
        //文件列表分页栏列表显示条数改变
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('directory/changeSize', size)
            this.searchHandler()
        },
        //文件列表分页栏页码改变
        handleCurrentChange(current) {
            this.$store.commit('directory/changeCurrent', current)
            this.searchHandler()
        },
        //左侧树按钮点击事件
        buttonEvent(param) {
            switch (param) {
                case 'createHandler':
                    this.createHandler()
                    break
                case 'modifyHandler':
                    this.modifyHandler()
                    break
                case 'deleteHandler':
                    this.deleteHandler()
                    break
            }
        }
    }
}
</script>
<style scopedSlots>
.directory .el-tree > .el-tree-node > .el-tree-node__content {
    font-weight: 700;
}
.directory .table_content .el-button {
    padding: 0 6px;
}
.directory .table_content img {
    width: 80px;
    position: relative;
    top: 3px;
}
.upload_box {
    height: 200px;
}
.el-table-column--selection .cell {
    padding-left: 14px !important;
}
.directory .weight-row {
    font-weight: 700 !important;
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
.cursor {
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: inline-block;
}
</style>
