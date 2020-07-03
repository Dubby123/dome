<template>
    <el-container class="main_body storage_form">
        <el-container class="dialog_box">
            <el-header class="form_title">{{ formTitle }}</el-header>
            <el-main class="form_content">
                <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                    <el-form-item label="节点名称" prop="isGroup">
                        <el-input v-model="form.nodeName" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="储存名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="IP地址" prop="ip">
                        <el-input v-model="form.ip"></el-input>
                    </el-form-item>
                    <el-form-item label="分配储存(T)" prop="diskSize">
                        <el-input-number v-model.number="form.diskSize" controls-position="right" :min="0" :max="100" size="medium" :step="0.1"></el-input-number>
                    </el-form-item>
                    <el-form-item label="备注" prop="desc" class="longer">
                        <el-input v-model="form.desc" type="textarea"></el-input>
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
    name: 'storageForm',
    components: {},
    data() {
        return {
            operateType: 'add',
            formTitle: '新增存储',
            form: {
                id: '',
                nodeId: '',
                nodeName: '',
                name: '',
                ip: '',
                diskSize: '',
                desc: ''
            },
            rules: Validate.storage
        }
    },
    computed: {
        ...mapGetters('storeManage', {
            currentNode: 'getCurrentNode',
            currentSelectRow: 'getCurrentSelectRow'
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
            this.form.nodeName = this.currentNode.name
            this.form.nodeId = this.currentNode.id
            if (this.operateType === 'edit' && Utils.isString(this.currentNode)) {
                this.formTitle = '修改存储'
                Utils.ObjectReflector(this.currentSelectRow, this.form)
            }
        },
        //提交操作form表单
        submitHandler(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return false
                }
                if (this.operateType === 'add') {
                    this.$store.dispatch('storeManage/createStorage', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'store_mange', replace: true })
                            }
                        })
                    )
                } else {
                    this.$store.dispatch('storeManage/saveStorage', this.form).then(res =>
                        BusinessUtil.CallbackHandler(res, true).then(() => {
                            if (res.status === Const.STATUS.SUCCESS) {
                                this.$store.commit('authConfig/removeTab', this.$route.name)
                                this.$router.push({ name: 'store_mange', replace: true })
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
            this.$router.push({ name: 'store_mange', replace: true })
        }
    }
}
</script>
<style>
.storage_form .el-input-number--medium {
    width: 100%;
}
</style>
