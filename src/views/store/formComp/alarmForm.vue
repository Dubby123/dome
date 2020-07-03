<template>
    <el-container class="main_body alarm_form">
        <el-container class="dialog_box interface_form">
            <el-header class="form_title">{{ formTitle }}</el-header>
            <el-main class="form_content">
                <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                    <el-form-item label="报警类型" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="报警编码" prop="code">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item label="存储报警区间" prop="storageVolMin">
                        <template>
                            <el-input-number v-model.number="form.storageVolMin" controls-position="right" :min="0" :max="100" size="medium"></el-input-number>
                            <span class="input_-">-</span>
                            <el-input-number v-model.number="form.storageVolMax" controls-position="right" :min="0" :max="100" size="medium"></el-input-number>
                        </template>
                    </el-form-item>
                    <el-form-item label="报警频率" prop="rate">
                        <el-input v-model.number="form.rate" placeholder="请输入">
                            <el-select v-model="form.unit" slot="append" placeholder="请选择">
                                <el-option value="1" label="每天"></el-option>
                                <el-option value="2" label="小时"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="通知人员" prop="alarmUserNames">
                        <el-input v-model="form.alarmUserNames" suffix-icon="el-icon-search" @click.native="openInnerDialog" readonly></el-input>
                    </el-form-item>
                </el-form>
                <div class="form_button_box">
                    <el-button type="primary" @click="submitHandler('form')">保存</el-button>
                    <el-button @click="cancelSubmit">取消</el-button>
                </div>
            </el-main>
            <el-dialog width="750px" title="选择通知人员" :visible.sync="innerVisible">
                <template>
                    <el-form :inline="true" class="search_form employee" size="small" label-width="80px">
                        <el-row>
                            <el-col :span="21">
                                <el-form-item label="人员名称">
                                    <el-input v-model="personName" placeholder="输入关键字查找" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="用户名">
                                    <el-input v-model="username" placeholder="输入关键字查找" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="searchPersonHandler">查询</el-button>
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-container class="dialog_content">
                        <el-main class="table_box">
                            <el-main class="table_content">
                                <el-table size="small" stripe height="100%" :data="personList" ref="multipleTableUser" @selection-change="selectInnerNode">
                                    <el-table-column type="selection"></el-table-column>
                                    <el-table-column type="index" label="序号"></el-table-column>
                                    <el-table-column prop="personName" label="人员名称" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
                                </el-table>
                            </el-main>
                            <el-pagination
                                @current-change="personCurrentChange"
                                :current-page="personCurrent"
                                :page-size="personSize"
                                layout="prev, pager, next"
                                :total="personTotal"
                            >
                            </el-pagination>
                        </el-main>
                    </el-container>
                </template>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitInnerDialog">确认</el-button>
                </div>
            </el-dialog>
        </el-container>
    </el-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import Utils from '@/common/utils'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import Validate from '@/common/validateFrom'
export default {
    name: 'alarmForm',
    components: {},
    data() {
        return {
            operateType: 'add',
            formTitle: '新增报警',
            form: {
                id: '',
                name: '',
                code: '',
                rate: '',
                storageVolMin: '',
                storageVolMax: 100,
                alarmUserIds: '',
                alarmUserNames: '',
                unit: '1'
            },
            rules: Validate.alarm,
            innerVisible: false,
            personName: '',
            username: '',
            multipleSelection: []
        }
    },
    computed: {
        ...mapState('alarmConfig', ['personCurrent', 'personSize', 'personTotal', 'personPages']),
        ...mapGetters('alarmConfig', {
            personList: 'getPersonList'
        })
    },
    mounted() {
        this.searchPersonHandler()
    },
    watch: {},
    methods: {
        //提交操作form表单
        submitHandler(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                if (!Utils.isString(this.form.id)) {
                    this.$store.dispatch('alarmConfig/createAlarm', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'store_alarm', replace: true })
                            }
                        })
                    )
                } else {
                    this.$store.dispatch('alarmConfig/saveAlarm', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'store_alarm', replace: true })
                            }
                        })
                    )
                }
                this.$refs[formName].clearValidate()
            })
        },
        //取消操作form表单提交
        cancelSubmit() {
            this.$store.commit('authConfig/removeTab', this.$route.name)
            this.$router.push({ name: 'store_alarm', replace: true })
        },
        //弹出框选择人员
        selectInnerNode(val) {
            this.multipleSelection = val
        },
        //弹出框人员查询
        searchPersonHandler() {
            let param = {
                personName: this.personName,
                username: this.username,
                size: this.personSize || 10,
                current: this.personCurrent || 1
            }
            this.$store.dispatch('alarmConfig/getPersonList', param)
        },
        //弹出框人员查询分页改变
        personCurrentChange(current) {
            this.$store.commit('alarmConfig/changePersonCurrent', current)
            this.searchPersonHandler()
        },
        //确认选择人员
        submitInnerDialog() {
            let ids = [],
                names = []
            this.multipleSelection.forEach(ele => {
                ids.push(ele.id)
                names.push(ele.username)
            })
            this.form.alarmUserIds = ids.join()
            this.form.alarmUserNames = names.join()
            this.innerVisible = false
        },
        //打开弹出框
        openInnerDialog() {
            //this.searchPersonHandler()
            this.innerVisible = true
        }
    }
}
</script>
<style>
.alarm_form .el-input-group__append .el-select {
    width: 76px;
}
.alarm_form .input_- {
    margin: 0 10px;
    color: #a6a6a6;
}
.alarm_form .el-input-number--medium {
    width: 108px;
}
.alarm_form .dialog_content .table_box {
    border: 1px solid #dcdcdc;
}
</style>
