<template>
    <el-container class="main_body log">
        <el-container>
            <el-header class="search_form">
                <el-form :inline="true" size="small" label-width="80px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="日志类型">
                                <el-select v-model="logType" placeholder="请选择日志类型">
                                    <el-option value="" label="全部"></el-option>
                                    <el-option v-for="(ele, index) in logTypeList" :value="ele" :key="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="报警时间">
                                <el-date-picker
                                    v-model="timeRange"
                                    type="datetimerange"
                                    :clearable="false"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="searchLogHandler">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">日志列表</span>
                    </el-header>
                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="logList">
                            <el-table-column type="index" label="序号" width="50px"></el-table-column>
                            <el-table-column prop="type" label="日志类型" min-width="20%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="createTime" label="操作时间" min-width="20%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="content" label="操作信息" min-width="18%" show-overflow-tooltip></el-table-column>
                            <el-table-column label="操作/通知人员" min-width="12%" prop="noticePersons">
                                <!-- <template slot-scope="scope">
                        <el-button type="text" @click="deleteStrategyHandler(scope.row)">删除</el-button>
                    </template> -->
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
export default {
    name: 'log',
    components: {},
    data() {
        return {
            logType: '',
            timeRange: '',
            pageSize: Const.PAGESIZE_CONFIG.normal
        }
    },
    computed: {
        ...mapState('logs', ['current', 'size', 'total', 'pages']),
        ...mapGetters('logs', {
            logList: 'getLogList',
            logTypeList: 'getLogTypeList'
        })
    },
    mounted() {
        let date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        this.timeRange = [this.dateTransfer(date), this.dateTransfer(new Date())]
        this.$store.dispatch('logs/getLogTypeList').then(res => {
            BusinessUtil.CallbackHandler(res)
            this.searchLogHandler()
        })
    },
    watch: {},
    methods: {
        //重置分页
        _resetCurrentPage() {
            this.$store.commit('logs/changeCurrent', 1)
        },
        //日志列表查询
        searchLogHandler() {
            let params = {
                current: this.current || 1,
                size: this.size || 10,
                beginTime: this.timeRange[0],
                endTime: this.timeRange[1],
                type: this.logType
            }
            this.$store.dispatch('logs/getLogList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //格式化时间
        dateTransfer(time) {
            let year = time.getFullYear(),
                month = time.getMonth() + 1,
                date = time.getDate(),
                times = time.toTimeString().split(' ')[0]
            return year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date) + ' ' + times
        },
        //切换条数
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('logs/changeSize', size)
            this.searchLogHandler()
        },
        //切换分页
        handleCurrentChange(current) {
            this.$store.commit('logs/changeCurrent', current)
            this.searchLogHandler()
        }
    }
}
</script>
<style scoped>
.log .el-range-editor--small.el-input__inner {
    height: 34px;
    border-radius: 0;
}
</style>
