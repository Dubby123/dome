<template>
    <el-container class="main_body store_clean">
        <el-container>
            <el-header class="search_form">
                <el-form :inline="true" size="small" label-width="80px">
                    <el-row>
                        <el-col :span="22">
                            <el-form-item label="清除策略">
                                <el-select v-model="strategy" placeholder="请选择清除策略" @change="changeStrategy">
                                    <el-option value="0" label="全部"></el-option>
                                    <el-option v-for="ele in cleanStrategy" :label="ele.name" :value="ele.id" :key="ele.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="文件名">
                                <el-input v-model="fileName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="文件类型">
                                <el-input v-model="fileType" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="上传时间">
                                <el-date-picker
                                    v-model="timeRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button type="primary" @click="searchCleanHandler">查询</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-header>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">文档列表</span>
                        <div class="table_btns">
                            <el-button type="primary" icon="el-icon-delete" @click="cleanStorageHandler('any')" plain>
                                删除
                            </el-button>
                            <el-button type="primary" icon="el-icon-document" @click="cleanStorageHandler('all')" plain>
                                删除所有
                            </el-button>
                        </div>
                    </el-header>
                    <el-main class="table_content">
                        <el-table size="small" stripe height="100%" :data="cleanList" @selection-change="selectionChangeHandler">
                            <el-table-column type="selection" width="50px"></el-table-column>
                            <el-table-column type="index" label="序号" width="50px"></el-table-column>
                            <el-table-column prop="fileName" label="文件名" min-width="20%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fileExtName" label="文件类型" min-width="20%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" min-width="18%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="updateTime" label="上传时间" min-width="12%"></el-table-column>
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
    name: 'storeClean',
    components: {},
    data() {
        return {
            strategy: '',
            fileType: '',
            fileName: '',
            timeRange: '',
            multipleSelection: [],
            pageSize: Const.PAGESIZE_CONFIG.normal
        }
    },
    computed: {
        ...mapState('storeClean', ['current', 'size', 'total', 'pages']),
        ...mapGetters('storeClean', {
            cleanList: 'getCleanList',
            cleanStrategy: 'getCleanStrategy'
        })
    },
    mounted() {
        let date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        this.timeRange = [this.dateTransfer(date), this.dateTransfer(new Date())]
        this.$store.dispatch('storeClean/getCleanStrategy').then(res => {
            BusinessUtil.CallbackHandler(res)
            this.searchCleanHandler()
        })
    },
    watch: {},
    methods: {
        //重置分页
        _resetCurrentPage() {
            this.$store.commit('storeClean/changeCurrent', 1)
        },
        //清除策略变化触发
        changeStrategy(val) {
            if (val !== '0') {
                let strategy = this.cleanStrategy.filter(ele => ele.id === val)
                this.fileType = strategy[0].fileTypes
                this.timeRange = [strategy[0].fileTime1, strategy[0].fileTime2]
            } else {
                this.fileType = ''
                let date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                this.timeRange = [this.dateTransfer(date), this.dateTransfer(new Date())]
            }
            this.fileName = ''
        },
        //文档查询
        searchCleanHandler() {
            let params = {
                current: this.current || 1,
                size: this.size || 10,
                beginTime: this.timeRange[0],
                endTime: this.timeRange[1],
                fileName: this.fileName,
                fileType: this.fileType
            }
            this.$store.dispatch('storeClean/getCleanList', params).then(res => {
                BusinessUtil.CallbackHandler(res)
            })
        },
        //格式化时间
        dateTransfer(time) {
            let year = time.getFullYear(),
                month = time.getMonth() + 1,
                date = time.getDate()
            return year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date)
        },
        //选中表格文档信息
        selectionChangeHandler(val) {
            this.multipleSelection = val
        },
        //删除或删除所有
        cleanStorageHandler(type) {
            if (this.multipleSelection.length === 0 && type === 'any') {
                return Message.warning({
                    showClose: true,
                    message: '请选择需要删除的文档'
                })
            }
            MessageBox.confirm('确定要删除' + (type !== 'all' ? '选中' : '当前列表所有') + '存储文件吗？', '确认提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = {}
                if (type !== 'all') {
                    params.operateType = 0
                    params.fileIds = this.multipleSelection.map(ele => ele.id).join()
                } else {
                    params.operateType = 1
                    params.beginTime = this.timeRange[0]
                    params.endTime = this.timeRange[1]
                    params.fileName = this.fileName
                    params.fileType = this.fileType
                }
                this.$store.dispatch('storeClean/cleanStorage', params).then(res =>
                    BusinessUtil.CallbackHandler(res, true).then(() => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.searchCleanHandler()
                        }
                    })
                )
            })
        },
        //切换每页显示条数
        handleSizeChange(size) {
            this._resetCurrentPage()
            this.$store.commit('storeClean/changeSize', size)
            this.searchCleanHandler()
        },
        //切换当前页
        handleCurrentChange(current) {
            this.$store.commit('storeClean/changeCurrent', current)
            this.searchCleanHandler()
        }
    }
}
</script>
<style>
.store_clean .el-date-editor--daterange.el-input__inner {
    width: 220px !important;
}
.store_clean .el-range-editor--small.el-input__inner {
    height: 34px;
    border-radius: 0;
}
.store_clean .el-range-editor--small .el-range-separator {
    line-height: 27px !important;
}
</style>
