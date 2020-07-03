<template>
    <el-container class="main_body">
        <el-container class="dialog_box interface_form">
            <el-header class="form_title">{{ formTitle }}</el-header>
            <el-main class="form_content">
                <el-form ref="userInterfaceForm" :model="userInterfaceForm" :rules="rules" label-width="160px">
                    <el-form-item label="用户名" v-if="operateType === 'edit'">
                        <el-input v-model="userInterfaceForm.editUserName" autocomplete="off" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" v-else prop="newUserName">
                        <el-input v-model="userInterfaceForm.newUserName" autocomplete="off" suffix-icon="el-icon-search" v-on:click.native="appointedPerson"></el-input>
                    </el-form-item>
                    <el-form-item label="appKey" class="longer" v-if="operateType === 'edit'">
                        <el-input v-model="userInterfaceForm.appKey" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="appSecret" class="longer" v-if="operateType === 'edit'">
                        <el-input v-model="userInterfaceForm.appSecret" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上传接口允许访问时间" class="longer">
                        <el-date-picker
                            v-model="userInterfaceForm.uploadTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="下载接口允许访问时间" class="longer">
                        <el-date-picker
                            v-model="userInterfaceForm.downloadTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="删除接口允许访问时间" class="longer">
                        <el-date-picker
                            v-model="userInterfaceForm.deleteTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注" class="longer">
                        <el-input type="textarea" v-model="userInterfaceForm.description" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div class="form_button_box">
                    <el-button type="primary" @click="userInterfaceUpdate" v-if="operateType === 'edit'">更新appKey</el-button>
                    <el-button type="primary" @click="submitHandler('userInterfaceForm')">保存</el-button>
                    <el-button @click="cancelSubmit">取消</el-button>
                </div>
            </el-main>
        </el-container>
        <el-dialog width="750px" title="选择人员" :visible.sync="dialogPeopleSelectVisible">
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
                            <el-table size="small" stripe height="100%" :data="userList" ref="multipleTableUser" @current-change="handleCurrentRow" highlight-current-row>
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
import AsideTree from '../../layout/aside.vue'
import Utils from '@/common/utils'
import { mapState, mapGetters } from 'vuex'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message } from 'element-ui'
export default {
    name: 'floderForm',
    components: {
        AsideTree
    },
    data() {
        return {
            operateType: 'add',
            formTitle: '新增用户',
            userInterfaceForm: {
                newUserName: '', //新建用户用户名
                editUserName: '', //修改用户用户名
                uploadTime: '',
                downloadTime: '',
                deleteTime: '',
                description: '', //新建用户备注
                appSecret: '',
                appKey: '',
                userId: '' //人员id
            },
            pageSize: Const.PAGESIZE_CONFIG.normal,
            dialogPeopleSelectVisible: false,
            departmentName: '',
            personName: '',
            currentRow: '',
            departmentListUser: [],
            rules: {
                newUserName: [{ required: true, message: '用户名不能为空', trigger: ['blur', 'change'] }]
            }
        }
    },
    computed: {
        ...mapState('fileManagement', ['userCurrent', 'sizeUser', 'currentTotal', 'pagesUser']),
        ...mapGetters('fileManagement', {
            userList: 'getUserList'
        }),
        ...mapGetters('interfaceManagement', {
            currentInterface: 'getCurrentInterface'
        })
    },
    mounted() {
        this.initForm(this.$route)
    },
    watch: {
        $route(to) {
            this.initForm(to)
        }
    },
    methods: {
        //判断当前表单操作并给表单赋值
        initForm(route) {
            this.operateType = /edit/g.test(route.name) ? 'edit' : 'add'
            // Utils.ObjectInit(this.form)
            if (this.operateType === 'edit' && Utils.isString(this.currentInterface)) {
                this.formTitle = '修改用户'
                this.userInterfaceForm.editUserName = this.currentInterface.userName
                this.userInterfaceForm.appKey = this.currentInterface.appKey
                this.userInterfaceForm.appSecret = this.currentInterface.appSecret
                this.userInterfaceForm.description = this.currentInterface.description
                if (this.currentInterface.uploadBeginTime && this.currentInterface.uploadEndTime) {
                    this.userInterfaceForm.uploadTime = [this.currentInterface.uploadBeginTime + ' ' + '00:00:00', this.currentInterface.uploadEndTime + ' ' + '00:00:00']
                }
                if (this.currentInterface.downloadBeginTime && this.currentInterface.downloadEndTime) {
                    this.userInterfaceForm.downloadTime = [this.currentInterface.downloadBeginTime + ' ' + '00:00:00', this.currentInterface.downloadEndTime + ' ' + '00:00:00']
                }
                if (this.currentInterface.deleteBeginTime && this.currentInterface.deleteEndTime) {
                    this.userInterfaceForm.deleteTime = [this.currentInterface.deleteBeginTime + ' ' + '00:00:00', this.currentInterface.deleteEndTime + ' ' + '00:00:00']
                }
                this.userInterfaceForm.userId = this.currentInterface.id
            }
        },
        //提交操作form表单
        submitHandler(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                console.log(this.userInterfaceForm.deleteTime)
                let params = {
                    deleteBeginTime: this.userInterfaceForm.deleteTime ? this.userInterfaceForm.deleteTime[0].slice(0, 10) : '',
                    deleteEndTime: this.userInterfaceForm.deleteTime ? this.userInterfaceForm.deleteTime[1].slice(0, 10) : '',
                    downloadBeginTime: this.userInterfaceForm.downloadTime ? this.userInterfaceForm.downloadTime[0].slice(0, 10) : '',
                    downloadEndTime: this.userInterfaceForm.downloadTime ? this.userInterfaceForm.downloadTime[1].slice(0, 10) : '',
                    uploadBeginTime: this.userInterfaceForm.uploadTime ? this.userInterfaceForm.uploadTime[0].slice(0, 10) : '',
                    uploadEndTime: this.userInterfaceForm.uploadTime ? this.userInterfaceForm.uploadTime[1].slice(0, 10) : '',
                    userId: this.userInterfaceForm.userId || '',
                    description: this.userInterfaceForm.description || ''
                }
                if (this.operateType === 'add') {
                    this.$store.dispatch('interfaceManagement/newUserInterface', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'interfaceManagement', replace: true })
                            }
                        })
                    )
                } else {
                    this.$store.dispatch('interfaceManagement/editUserAppsecret', params).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'interfaceManagement', replace: true })
                            }
                        })
                    )
                }
                this.$refs[formName].clearValidate()
            })
        },
        //打开选择人员的弹出框
        appointedPerson() {
            this.$store.dispatch('interfaceManagement/getDepartmentTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.departmentListUser = res.data
                        this.dialogPeopleSelectVisible = true
                        this.searchUserList()
                    }
                })
            })
        },
        //取消操作form表单提交
        cancelSubmit() {
            this.$store.commit('authConfig/removeTab', this.$route.name)
            this.$router.push({ name: 'interfaceManagement', replace: true })
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
        //人员选择弹出框点击左侧树
        chooseInnerTreeNode(val) {
            this.departmentId = val.id
            this.searchUserList()
            this.departmentId = ''
        },
        //弹出框选择用户
        handleCurrentRow(val) {
            this.currentRow = val
        },
        //弹出框人员选择切换分页
        handleCurrentChangeUser(userCurrent) {
            this.$store.commit('fileManagement/changeUserCurrent', userCurrent)
            this.searchUserList()
        },
        //弹出框选择用户
        submitChoosePersonHandler() {
            if (!this.currentRow) {
                return Message.warning('请选择人员')
            }
            this.userInterfaceForm.userId = this.currentRow.id
            this.userInterfaceForm.newUserName = this.currentRow.personName
            this.dialogPeopleSelectVisible = false
            this.currentRow = ''
        },
        //修改时更新appKey
        userInterfaceUpdate() {
            this.$store.dispatch('interfaceManagement/refreshUserAppsecret', { id: this.userInterfaceForm.userId }).then(res => {
                BusinessUtil.CallbackHandler(res, true).then(() => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.$router.push({ name: 'interfaceManagement', replace: true })
                    }
                })
            })
        }
    }
}
</script>
<style>
.interface_form .el-date-editor--daterange.el-input__inner {
    width: 100%;
}
.interface_form .el-date-editor .el-range-separator {
    background: #f1f1f1;
    display: inline-block;
    height: 38px;
    line-height: 36px;
    border: 1px solid #ced6dc;
}
</style>
