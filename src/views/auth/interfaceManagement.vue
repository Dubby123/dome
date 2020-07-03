<template>
    <el-container class="main_body">
        <el-container>
            <el-header class="search_form">
                <el-form :inline="true" size="small" label-width="80px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="用户名">
                                <el-input v-model="userName" placeholder="输入关键字查找" clearable></el-input>
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
                        <span class="table_title">权限列表</span>
                        <div class="table_btns">
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createHandler" plain>
                                新增
                            </el-button>
                            <el-button type="primary" icon="el-icon-edit" @click="modifyHandler" plain>
                                修改
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteHandler" plain>
                                删除
                            </el-button>
                        </div>
                    </el-header>
                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="userInterfaceList" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="65" align="center"></el-table-column>
                            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                            <el-table-column prop="userName" label="用户名" min-width="12%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="appKey" label="appKey" min-width="40%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="appSecret" label="appSecret" min-width="40%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="allowUploadTime" label="允许上传时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="allowDownloadTime" label="允许下载时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="allowdeleteTime" label="允许删除时间" min-width="30%" show-overflow-tooltip align="center"></el-table-column>
                            <el-table-column prop="description" label="备注" min-width="10%" show-overflow-tooltip align="center"></el-table-column>
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
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'interfaceManagement',
    components: {},
    data() {
        return {
            userName: '',
            pageSize: Const.PAGESIZE_CONFIG.normal,
            multipleSelection: []
        }
    },
    computed: {
        ...mapState('interfaceManagement', ['size', 'current', 'total', 'pages', 'userInterfaceList']),
        ...mapGetters('interfaceManagement', {
            userInterfaceList: 'getInterfaceList'
        })
    },
    mounted() {
        this.searchHandler()
    },
    watch: {
        userName: '_resetCurrentPage'
    },
    methods: {
        //重置当前页
        _resetCurrentPage() {
            this.$store.commit('interfaceManagement/changeCurrent', 1)
        },
        //新增接口权限
        createHandler() {
            this.$router.push({ name: 'addInterface', replace: true })
        },
        //修改人员接口权限
        modifyHandler() {
            if (this.multipleSelection.length === 0 || this.multipleSelection.length > 1) {
                return Message.warning({
                    message: '请选择一个需要修改的用户接口',
                    showClose: true
                })
            }
            this.$router.push({ name: 'editInterface', replace: true })
        },
        //删除人员接口权限
        deleteHandler() {
            this.multipleSelection.length === 0 || this.multipleSelection.length > 1
                ? Message.warning({
                      message: '请选择一个需要删除的接口权限',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除人员:' + this.multipleSelection[0].userName + '的接口权限吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  })
                      .then(() => {
                          this.$store.dispatch('interfaceManagement/deleteUserInterface', this.multipleSelection[0].id).then(res =>
                              BusinessUtil.CallbackHandler(res, true).then(() => {
                                  this.searchHandler()
                              })
                          )
                      })
                      .catch(e => console.log(e))
        },
        //接口权限列表查询
        searchHandler() {
            let params = {
                current: this.current || 1,
                size: this.size || 10,
                userName: this.userName || ''
            }
            this.$store.dispatch('interfaceManagement/getInterfaceList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //接口表格选择人员
        handleSelectionChange(val) {
            this.multipleSelection = val
            this.$store.commit('interfaceManagement/setCurrentInterface', this.multipleSelection[0])
        },
        //切换每页显示条数
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('interfaceManagement/changeSize', size)
            this.searchHandler()
        },
        //切换当前页
        handleCurrentChange(current) {
            this.$store.commit('interfaceManagement/changeCurrent', current)
            this.searchHandler()
        }
    }
}
</script>
