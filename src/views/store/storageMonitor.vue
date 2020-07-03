<template>
    <el-container class="main_body store_box">
        <AsideTree ref="nodeTree" :tree="nodeTree" :listName="listName" :button="true" v-on:chooseNode="chooseNode" v-on:buttonEvent="buttonEvent" />
        <el-container>
            <el-main class="main_table">
                <el-container class="table_box">
                    <el-header class="table_header">
                        <span class="table_title">存储列表</span>
                        <div class="table_btns">
                            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createStoreageHandler" plain>
                                新增
                            </el-button>
                            <el-button type="primary" icon="el-icon-edit" @click="editStoreageHandler" plain>
                                修改
                            </el-button>
                            <el-button type="primary" icon="el-icon-delete" @click="deleteStoreageHandler" plain>
                                删除
                            </el-button>
                        </div>
                    </el-header>
                    <div class="table_content_storeMonitor">
                        <el-table size="small" stripe height="100%" :data="storeMonitorList" highlight-current-row ref="storeMonitor" @current-change="currentSelectChange">
                            <el-table-column prop="name" label="储存名称" min-width="25%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="ip" label="IP地址" min-width="25%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="diskSize" label="分配储存(TB)" min-width="25%" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="useSize" label="已使用储存(TB)" min-width="25%" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    {{ scope.row.useSize ? Math.round(scope.row.useSize * 1000000) / 1000000 : '--' }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="info-box">
                        <div class="box-title">{{ storeName }}容量</div>
                        <el-progress :text-inside="true" :stroke-width="24" :show-text="true" color="#3e8ef7" :percentage="percentage"></el-progress>
                        <div class="progress-info">
                            <span><i></i> 已使用{{ useSize }}T </span>
                            <span class="all-store-use"> <i></i>实际可用{{ diskSize }}T </span>
                        </div>
                    </div>
                    <div class="echarts-box">
                        <!-- <div class="box-title">容量</div> -->
                        <Echarts id="echarts" :options="echartsOptions"></Echarts>
                    </div>
                </el-container>
            </el-main>
        </el-container>
        <el-dialog width="600px" :title="nodeFormTitle" :visible.sync="nodeFormVisible" append-to-body>
            <el-form :model="nodeForm" class="table-form" ref="nodeForm" :rules="nodeRules" label-width="120px">
                <el-form-item label="节点编码" prop="code" class="longer">
                    <el-input v-model="nodeForm.code"></el-input>
                </el-form-item>
                <el-form-item label="节点名称" prop="name" class="longer">
                    <el-input v-model="nodeForm.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitNodeForm('nodeForm')">保 存</el-button>
                <el-button @click="nodeFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>
<script>
import AsideTree from '../layout/aside.vue'
import { mapGetters } from 'vuex'
import Echarts from '@/components/echarts'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'storageMonitor',
    components: {
        AsideTree,
        Echarts
    },
    data() {
        return {
            listName: '节点列表',
            currentSelectRow: '',
            currentSelectRowId: '',
            currentNodeId: '',
            percentage: 0,
            useSize: '',
            diskSize: '',
            storeName: '',
            echartsOptions: {},
            nodeFormVisible: false,
            nodeFormTitle: '',
            nodeForm: {
                id: '',
                name: '',
                code: ''
            },
            nodeRules: {
                name: [
                    { required: true, message: '节点名称不能为空!', trigger: 'blur' },
                    { max: 20, message: '名称长度在20个字符之内!', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '节点编码不能为空!', trigger: 'blur' },
                    { max: 20, message: '编码长度在20个字符之内!', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters('storeManage', {
            nodeTree: 'getNodeTree',
            currentNode: 'getCurrentNode',
            storeMonitorList: 'getStoreMonitorList',
            echartsData: 'getEchartsData'
        })
    },
    mounted() {
        this.searchNodeHandler()
    },
    watch: { currentNodeId: 'searchMonitorHandler', currentSelectRowId: 'currentSelectRowIdChange' },
    methods: {
        //节点树查询
        searchNodeHandler() {
            this.$store.dispatch('storeManage/getNodeTree').then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (this.nodeTree.length > 0) {
                        let getCurrentNode = this.nodeTree.filter(ele => ele.id === this.currentNode.id)
                        let currentNode = getCurrentNode > 0 ? getCurrentNode[0] : this.nodeTree[0]
                        this.$refs.nodeTree.setCurrentKey(currentNode.id)
                        this.$store.commit('storeManage/setCurrentNode', currentNode)
                        this.currentNodeId = currentNode.id
                    }
                })
            })
        },
        //节点树点击事件
        chooseNode(val) {
            this.$store.commit('storeManage/setCurrentNode', val)
            this.currentNodeId = val.id
        },
        //新增存储
        createStoreageHandler() {
            if (!Utils.isString(this.currentNodeId)) {
                return Message.warning({
                    message: '请选择一个需要新增储存的节点！',
                    showClose: true
                })
            }
            this.$router.push({ name: 'addStorageMonitor', replace: true })
        },
        //修改存储
        editStoreageHandler() {
            if (!Utils.isString(this.currentNodeId)) {
                return Message.warning({
                    message: '请选择一个需要修改的储存！',
                    showClose: true
                })
            }
            this.$router.push({ name: 'editStorageMonitor', replace: true })
        },
        //点击选择存储信息
        currentSelectChange(val) {
            this.currentSelectRow = val ? val : ''
            this.currentSelectRowId = val ? val.id : ''
        },
        //当选中存储信息改变时触发
        currentSelectRowIdChange() {
            this.setCurrentSelectRow()
            this.getEchartsData()
        },
        //存储当前存储信息，以便修改表单获取
        setCurrentSelectRow() {
            this.$store.commit('storeManage/setCurrentSelectRow', this.currentSelectRow)
        },
        //左侧树按钮点击事件
        buttonEvent(param) {
            switch (param) {
                case 'createHandler':
                    this.createNodeHandler()
                    break
                case 'modifyHandler':
                    this.editNodeHandler()
                    break
                case 'deleteHandler':
                    this.deleteNodeHandler()
                    break
            }
        },
        //修改节点
        editNodeHandler() {
            if (!Utils.isString(this.currentNodeId)) {
                return Message.warning({
                    message: '请选择一个需要修改的节点！',
                    showClose: true
                })
            }
            Utils.ObjectReflector(this.currentNode, this.nodeForm)
            this.nodeFormTitle = '修改节点'
            this.nodeFormVisible = true
            this.$nextTick(() => {
                this.$refs['nodeForm'].clearValidate()
            })
        },
        //删除节点
        deleteNodeHandler() {
            !Utils.isString(this.currentNodeId)
                ? Message.warning({
                      message: '请选择一个需要删除的节点！',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除节点:' + this.currentNode.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      this.$store.dispatch('storeManage/deleteNode', this.currentNode.id).then(res =>
                          BusinessUtil.CallbackHandler(res, true).then(() => {
                              this.currentNode = ''
                              this.searchNodeHandler()
                          })
                      )
                  })
        },
        //修改或删除节点提交表单
        submitNodeForm(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                if (this.nodeForm.id === '') {
                    this.$store.dispatch('storeManage/createNode', this.nodeForm).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            this.nodeFormVisible = false
                            this.searchNodeHandler()
                        })
                    )
                } else {
                    this.$store.dispatch('storeManage/saveNode', this.nodeForm).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            this.nodeFormVisible = false
                            this.searchNodeHandler()
                        })
                    )
                }
            })
        },
        //获得echars数据
        getEchartsData() {
            if (this.currentSelectRowId !== '') {
                this.$store.dispatch('storeManage/getEchartsData', { serverId: this.currentSelectRowId }).then(res => {
                    BusinessUtil.CallbackHandler(res).then(() => {
                        this.echartsOptions = this.optionsCreate(this.echartsData)
                    })
                })
            }
        },
        //查询存储信息
        searchMonitorHandler() {
            this.$store.dispatch('storeManage/getStoreMonitorList', { nodeId: this.currentNodeId }).then(res => {
                BusinessUtil.CallbackHandler(res).then(() => {
                    if (res.status == Const.STATUS.SUCCESS) {
                        if (this.storeMonitorList.length > 0) {
                            this.currentSelectRow = this.storeMonitorList[0]
                            this.currentSelectRowId = this.storeMonitorList[0].id
                            console.log(this.currentSelectRow)
                            this.storeName = this.currentSelectRow.name
                            this.$refs.storeMonitor.setCurrentRow(this.currentSelectRow)
                            if (this.currentSelectRow.useSize && this.currentSelectRow.diskSize) {
                                this.useSize = Math.round(this.currentSelectRow.useSize * 1000000) / 1000000
                                this.diskSize = this.currentSelectRow.diskSize
                                this.percentage = Math.round((this.useSize / this.diskSize) * 100000) / 1000
                            } else {
                                this.percentage = 0
                                this.useSize = this.currentSelectRow.useSize ? this.currentSelectRow.useSize : '--'
                                this.diskSize = this.currentSelectRow.diskSize ? this.currentSelectRow.diskSize : '--'
                            }
                        } else {
                            this.useSize = '--'
                            this.diskSize = '--'
                            this.percentage = 0
                            this.storeName = '--'
                        }
                    }
                })
            })
        },
        //新增节点
        createNodeHandler() {
            Utils.ObjectInit(this.nodeForm)
            this.nodeFormTitle = '新增节点'
            this.nodeFormVisible = true
            this.$nextTick(() => {
                this.$refs['nodeForm'].clearValidate()
            })
        },
        //删除存储
        deleteStoreageHandler() {
            !Utils.isString(this.currentSelectRow)
                ? Message.warning({
                      message: '请选择一个需要删除的储存！',
                      showClose: true
                  })
                : MessageBox.confirm('确定要删除储存:' + this.currentSelectRow.name + '吗？', '确认提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {
                      this.$store.dispatch('storeManage/deleteStorage', this.currentSelectRowId).then(res =>
                          BusinessUtil.CallbackHandler(res, true).then(() => {
                              this.currentSelectRow = ''
                              this.currentSelectRowId = ''
                              this.searchMonitorHandler()
                          })
                      )
                  })
        },
        //echars数据
        optionsCreate(data) {
            // let textColor = this.$store.state.authConfig.currentTheme.lightOrBlack === '1' ? 'rgba(255,255,255,0.5)' : '#333'
            let textColor = '#333'
            let options = {
                title: {
                    text: '存储容量趋势图',
                    padding: [5, 0, 0, 15],
                    textStyle: {
                        color: textColor,
                        fontSize: 13
                    }
                },
                color: ['#ffa406', '#0e4eff', '#ff3737'],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    textStyle: {
                        color: textColor
                    },
                    data: ['已用', '总共']
                },
                grid: { x: 60, y: 50, x2: 40, y2: 40 },
                xAxis: [
                    {
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                color: textColor
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        boundaryGap: false,
                        data: data.axis
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: textColor
                            }
                        },
                        splitLine: {
                            show: false
                        },
                        axisLabel: {
                            formatter: '{value}T'
                        }
                    }
                ],
                series: [
                    {
                        name: '已用',
                        type: 'line',
                        symbol: 'square',
                        smooth: true,
                        data: data.useData
                    },
                    {
                        name: '总共',
                        type: 'line',
                        symbol: 'square',
                        smooth: true,
                        data: data.totalData
                    }
                ]
            }
            return options
        }
    }
}
</script>
<style>
.store_box .table_box {
    display: flex;
}
.table_content_storeMonitor {
    height: 144px;
}
.table_content_storeMonitor .el-table {
    height: 144px;
}
.info-box {
    height: 84px;
    border: 1px solid #dcdcdc;
    margin: 12px 0;
    padding: 10px;
}
.info-box .box-title {
    padding-bottom: 5px;
}
.info-box i {
    height: 12px;
    width: 12px;
    background: #3e8ef7;
    display: inline-block;
    border-radius: 50%;
    margin-right: 3px;
}
.all-store-use i {
    margin-left: 50px;
    background: #e8e8e8;
}
.info-box .progress-info {
    padding: 6px 0;
}
.info-box .el-progress-bar__outer {
    height: 32px !important;
    border-radius: 0;
}
.info-box .el-progress-bar__inner {
    border-radius: 0;
}
.echarts-box {
    border: 1px solid #dcdcdc;
    flex: 1;
}
</style>
