<template>
    <el-container>
        <el-header class="search_form share_file_box">
            <el-form :inline="true" size="small" label-width="80px">
                <el-row>
                    <el-col :span="22">
                        <el-form-item label="分享名称">
                            <el-input v-model="fileName" placeholder="输入关键字查找" clearable></el-input>
                        </el-form-item>
                        <div style="display:inline-block">
                            <el-form-item label="分享时间">
                                <el-date-picker v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" :picker-options="startDatePicker">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" :picker-options="endDatePicker">
                                </el-date-picker>
                            </el-form-item>
                        </div>
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
                    <span class="table_title">我的分享列表</span>
                </el-header>
                <el-main class="table_content">
                    <el-table size="small" stripe height="100%" :data="shareFileList">
                        <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                        <el-table-column prop="shareName" label="分享名称" min-width="50%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="preview" label="浏览次数" min-width="15%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="download" label="下载次数" min-width="25%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="shareTime" label="分享时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column prop="shareTimeTypeDesc" label="失效时间" min-width="20%" show-overflow-tooltip align="center"></el-table-column>
                        <el-table-column label="操作" min-width="20%" show-overflow-tooltip align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click.stop="seeFileShare(scope.$index)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <footer class="table_footer">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentShare"
                        :page-sizes="pageSize"
                        :page-size="sizeShare"
                        layout="total, sizes, prev, pager, next, jumper, slot"
                        :total="totalShare"
                        prev-text="上一页"
                        next-text="下一页"
                    >
                    </el-pagination>
                </footer>
            </el-container>
        </el-main>
        <!-- 文件分享弹出框 -->
        <el-dialog title="文件分享" :visible.sync="dialogFileShareVisible" width="650px" class="fileshare-box">
            <el-form :model="shareFileForm" class="table-form" label-width="90px">
                <el-form-item class="longer shareradio" label="分享方式" :disabled="shareEdit">
                    <el-radio v-model="shareFileForm.shareType" label="0" :disabled="shareEdit">加密</el-radio>
                    <el-radio v-model="shareFileForm.shareType" label="1" :disabled="shareEdit">公开</el-radio>
                    <el-radio v-model="shareFileForm.shareType" label="2" :disabled="shareEdit">指定人员</el-radio>
                </el-form-item>
                <el-form-item label="提取密码" class="longer" v-if="shareFileForm.filePasswordVisible">
                    <el-input v-model="shareFileForm.filePassword" autocomplete="off" :disabled="shareEdit"></el-input>
                </el-form-item>
                <el-form-item label="有效期" class="longer">
                    <el-input v-model="shareFileForm.validityTime" autocomplete="off" :disabled="shareEdit"></el-input>
                </el-form-item>
                <el-form-item class="longer shareradio" label="允许下载">
                    <el-radio v-model="shareFileForm.allowDownload" label="1" :disabled="shareEdit">是</el-radio>
                    <el-radio v-model="shareFileForm.allowDownload" label="0" :disabled="shareEdit">否</el-radio>
                </el-form-item>
                <el-form-item label="访问地址" class="longer" show-overflow-tooltip>
                    <el-input v-model="shareFileForm.accessAddress" autocomplete="off" :disabled="shareEdit"></el-input>
                </el-form-item>
                <el-form-item label="指定人员" class="longer" v-if="shareFileForm.shareType === '2'">
                    <el-input v-model="shareFileForm.appointedPersonName" autocomplete="off" suffix-icon="el-icon-search" :disabled="shareEdit"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyLinks" class="tag-read-links" :data-clipboard-text="shareFileForm.accessAddress">复制链接</el-button>
                <el-button @click="dialogFileShareVisible = false">确定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import Clipboard from 'clipboard'
import { Message } from 'element-ui'
export default {
    name: 'group',
    components: {},
    data() {
        return {
            fileName: '',
            pageSize: Const.PAGESIZE_CONFIG.normal,
            startTime: '',
            endTime: '',
            startDatePicker: this.beginDate(),
            endDatePicker: this.processDate(),
            dialogFileShareVisible: false,
            shareFileForm: {
                shareType: '', //分享方式
                validityTime: '', //有效期
                allowDownload: '', //是否允许下载
                appointedPerson: '', //指定接收人员id
                appointedPersonName: '', //指定接收人员名称
                filePasswordVisible: false, //提取密码框
                filePassword: '', //提取密码
                accessAddress: '' //文件访问地址
            },
            shareEdit: true
        }
    },
    computed: {
        ...mapState('fileManagement', ['currentShare', 'sizeShare', 'totalShare', 'pagesShare']),
        ...mapGetters('fileManagement', {
            shareFileList: 'getShareFileList'
        })
    },
    mounted() {
        this._resetCurrentPage()
        this.searchHandler()
    },
    watch: {
        fileName: '_resetCurrentPage'
    },
    methods: {
        //获得我的分享
        searchHandler() {
            let params = {
                fileName: this.fileName || '',
                beginTime: !this.startTime ? '' : this.startTime,
                endTime: !this.endTime ? '' : this.endTime,
                current: this.currentShare || 1,
                size: this.sizeShare || 10,
                fileType: this.fileType || ''
            }
            this.$store.dispatch('fileManagement/getShareFileList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
                document.getElementById('myshare').style.background = '#2483ff'
                document.getElementById('myshare').style.color = '#fff'
                document.getElementById('myfilelist').style.background = 'inherit'
                document.getElementById('myfilelist').style.color = 'inherit'
            })
        },
        //查看我的分享
        seeFileShare(index) {
            this.shareEdit = true
            this.shareFileForm.filePasswordVisible = false
            let shareFile = this.shareFileList[index]
            this.dialogFileShareVisible = true
            this.shareFileForm.shareType = shareFile.shareMode
            let strUrl = window.location.href
            let start = strUrl.indexOf('#') //获得字符串的开始位置
            let result = strUrl.substring(0, start + 1) //截取字符串
            this.shareFileForm.accessAddress = Utils.StringConcat(result, '/file/fileShare?id=', shareFile.shortUrl)
            if (this.shareFileForm.shareType === '0') {
                this.shareFileForm.filePasswordVisible = true
                this.shareFileForm.filePassword = shareFile.secretKey
            }
            this.shareFileForm.appointedPersonName = shareFile.sharePersons
            this.shareFileForm.validityTime = shareFile.shareTimeType
            this.shareFileForm.allowDownload = shareFile.allowOriginalFile
        },
        //查看我的分享内容时新增复制链接按钮
        copyLinks() {
            let clipboard = new Clipboard('.tag-read-links')
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
        //重置分页当前页
        _resetCurrentPage() {
            this.$store.commit('fileManagement/changeCurrentShare', 1)
        },
        //分页栏列表显示条数改变
        handleSizeChange(sizeShare) {
            this._resetCurrentPage()
            this.$store.commit('fileManagement/changeSizeShare', sizeShare)
            this.searchHandler()
        },
        //分页栏页码改变
        handleCurrentChange(currentShare) {
            this.$store.commit('fileManagement/changeCurrentShare', currentShare)
            this.searchHandler()
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
.share_file_box .el-date-editor.el-input {
    width: auto;
}
</style>
