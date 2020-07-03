<template>
    <el-container class="main_body">
        <el-container>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">删除策略列表</span>
                        <div class="table_btns">
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createHandler" plain>
                                新增
                            </el-button>
                        </div>
                    </el-header>
                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="strategyList">
                            <el-table-column type="index" label="序号" width="50px"></el-table-column>
                            <el-table-column prop="name" label="删除策略" min-width="15%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="storageVol" label="存储使用量" min-width="12%" show-overflow-tooltip></el-table-column>
                            <el-table-column label="删除时间区间" min-width="22%" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{ scope.row.fileTime1 + ' - ' + scope.row.fileTime2 }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="fileTypes" label="删除文件类型" min-width="12%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="level" label="优先级" min-width="12%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="autoExec" label="是否自动执行" min-width="12%" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{ scope.row.autoExec === '0' ? '否' : '是' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="12%">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="deleteStrategyHandler(scope.row)">删除</el-button>
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
    name: 'cleanStrategy',
    components: {},
    data() {
        return {
            pageSize: Const.PAGESIZE_CONFIG.normal
        }
    },
    computed: {
        ...mapState('cleanStrategy', ['current', 'size', 'total', 'pages']),
        ...mapGetters('cleanStrategy', {
            strategyList: 'getStrategyList'
        })
    },
    mounted() {
        this.searchStrategyHandler()
    },
    watch: {},
    methods: {
        //重置分页
        _resetCurrentPage() {
            this.$store.commit('cleanStrategy/changeCurrent', 1)
        },
        //搜索查询列表
        searchStrategyHandler() {
            let params = {
                current: this.current || 1,
                size: this.size || 10
            }
            this.$store.dispatch('cleanStrategy/getStrategyList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //新增策略
        createHandler() {
            this.$router.push({ name: 'addStrategy', replace: true })
        },
        //表格内删除策略
        deleteStrategyHandler(data) {
            MessageBox.confirm('确定要删除策略:' + data.name + '吗？', '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('cleanStrategy/deleteStrategy', data.id).then(res =>
                    BusinessUtil.CallbackHandler(res).then(() => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.searchStrategyHandler()
                        }
                    })
                )
            })
        },
        //切换每页显示条数
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('cleanStrategy/changeSize', size)
            this.searchStrategyHandler()
        },
        //切换分页
        handleCurrentChange(current) {
            this.$store.commit('cleanStrategy/changeCurrent', current)
            this.searchStrategyHandler()
        }
    }
}
</script>
<style scoped></style>
