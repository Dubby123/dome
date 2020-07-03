<template>
    <el-container class="main_body">
        <el-container class="dialog_box interface_form">
            <el-header class="form_title">{{ formTitle }}</el-header>
            <el-main class="form_content">
                <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                    <el-form-item label="删除策略" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="策略编码" prop="code">
                        <el-input v-model="form.code"></el-input>
                    </el-form-item>
                    <el-form-item label="存储使用量(%)" prop="storageVol">
                        <el-input v-model.number="form.storageVol"></el-input>
                    </el-form-item>
                    <el-form-item label="删除文件类型" prop="fileTypes">
                        <el-input v-model="form.fileTypes"></el-input>
                    </el-form-item>
                    <el-form-item label="优先级" prop="level" class="longer">
                        <el-input v-model.number="form.level"></el-input>
                    </el-form-item>
                    <el-form-item label="删除文件时间" prop="timeRange" class="longer">
                        <el-date-picker
                            v-model="form.timeRange"
                            type="daterange"
                            :clearable="false"
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="自动执行策略" prop="autoExec" class="longer">
                        <el-radio-group v-model="form.autoExec">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div class="form_button_box">
                    <el-button type="primary" @click="submitHandler('form')">保存</el-button>
                    <el-button @click="cancelSubmit">取消</el-button>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
import Utils from '@/common/utils'
import { mapGetters } from 'vuex'
import BusinessUtil from '@/common/businessUtils'
import Const from '@/common/const'
import Validate from '@/common/validateFrom'
export default {
    name: 'strategyForm',
    components: {},
    data() {
        return {
            operateType: 'add',
            formTitle: '新增策略',
            form: {
                id: '',
                name: '',
                code: '',
                storageVol: '',
                fileTypes: '',
                level: '',
                timeRange: '',
                fileTime1: '',
                fileTime2: '',
                autoExec: 0
            },
            rules: Validate.addStrategy
        }
    },
    computed: {
        ...mapGetters('authConfig', {
            tabsList: 'getTabsList'
        })
    },
    mounted() {
        console.log()
    },
    watch: {},
    methods: {
        //提交操作form表单
        submitHandler(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                this.form.fileTime1 = this.form.timeRange[0]
                this.form.fileTime2 = this.form.timeRange[1]
                if (!Utils.isString(this.form.id)) {
                    this.$store.dispatch('cleanStrategy/createStrategy', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$parent.$parent.$parent.$parent.$refs.tab.handleTabsRemove(this.$route.name)
                                this.$router.push({ name: 'cleanStrategy', replace: true })
                            }
                        })
                    )
                } else {
                    this.$store.dispatch('cleanStrategy/saveStrategy', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$parent.$parent.$parent.$parent.$refs.tab.handleTabsRemove(this.$route.name)
                                this.$router.push({ name: 'cleanStrategy', replace: true })
                            }
                        })
                    )
                }
                this.$refs[formName].clearValidate()
            })
        },
        //取消操作form表单提交
        cancelSubmit() {
            this.$parent.$parent.$parent.$parent.$refs.tab.handleTabsRemove(this.$route.name)
            this.$router.push({ name: 'cleanStrategy', replace: true })
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
