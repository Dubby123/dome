<template>
    <el-container class="main_body">
        <el-container>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">报警列表</span>
                        <div class="table_btns">
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createAlarmHandler" plain>
                                新增
                            </el-button>
                        </div>
                    </el-header>
                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="alarmList">
                            <el-table-column type="index" label="序号" width="50px"></el-table-column>
                            <el-table-column prop="name" label="报警类型" min-width="20%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="storageVolMax" label="储存使用量" min-width="20%" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{ scope.row.storageVolMin + '% - ' + scope.row.storageVolMax + '%' }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="rateUnit" label="报警频率" min-width="18%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="alarmPersons" label="通知人员" min-width="30%" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作" min-width="12%">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteAlarmHandler(scope.row)">删除</el-button>
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
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { MessageBox } from 'element-ui'
export default {
    name: 'alarmConfig',
    components: {},
    data() {
        return {
            pageSize: Const.PAGESIZE_CONFIG.normal
        }
    },
    computed: {
        ...mapState('alarmConfig', ['current', 'size', 'total', 'pages']),
        ...mapGetters('alarmConfig', {
            alarmList: 'getAlarmList'
        })
    },
    mounted() {
        this.searchAlarmHandler()
    },
    watch: {},
    methods: {
        //重置分页
        _resetCurrentPage() {
            this.$store.commit('alarmConfig/changeCurrent', 1)
        },
        //查询报警列表
        searchAlarmHandler() {
            let params = {
                current: this.current || 1,
                size: this.size || 10
            }
            this.$store.dispatch('alarmConfig/getAlarmList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //新建报警
        createAlarmHandler() {
            this.$router.push({ name: 'addAlarm', replace: true })
        },
        //表格内删除报警
        deleteAlarmHandler(data) {
            MessageBox.confirm('确定要删除报警:' + data.name + '吗？', '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('alarmConfig/deleteAlarm', data.id).then(res =>
                    BusinessUtil.CallbackHandler(res).then(() => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.searchAlarmHandler()
                        }
                    })
                )
            })
        },
        //切换表格每页显示条数
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('alarmConfig/changeSize', size)
            this.searchAlarmHandler()
        },
        //切换分页
        handleCurrentChange(current) {
            this.$store.commit('alarmConfig/changeCurrent', current)
            this.searchAlarmHandler()
        }
    }
}
</script>
<style scoped></style>
