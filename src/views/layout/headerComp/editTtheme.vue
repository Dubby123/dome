<template>
    <div>
        <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
                <i class="icon icon-theme" title="切换主题" style="font-size:20px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="theme">切换主题色</el-dropdown-item>
                <el-dropdown-item command="dark" v-html="lightOrBlack === '1' ? '切换至白天版' : '切换至黑夜版'"></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog center title="切换主题色" :visible.sync="dialogForm" width="30%" append-to-body>
            <el-form :model="colors" ref="colors" class="theme-form" label-position="top" label-width="70px">
                <el-form-item prop="primary" label="主题色">
                    <el-color-picker v-model="colors.primary"></el-color-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">切 换</el-button>
                <el-button @click="resetHandler">重 置</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Config from '@/common/api'
import { Message } from 'element-ui'
export default {
    name: 'editTtheme',
    data() {
        return {
            dialogForm: false,
            lightOrBlack: '2',
            colors: { primary: '' }
        }
    },
    methods: {
        handleCommand(command) {
            if (command === 'theme') {
                this.dialogForm = true
            } else {
                this.changeTheme()
            }
        },
        // 切换白天黑夜版主题颜色
        changeTheme() {
            let data = this.$store.getters['authConfig/getCurrentTheme']
            if (this.lightOrBlack === '1') {
                this.lightOrBlack = '2'
            } else if (this.lightOrBlack === '2') {
                this.lightOrBlack = '1'
            }
            if (this.lightOrBlack === '1') {
                this.primaryColor = '#2B3153'
                this.colors.primary = data.primary
                this.toggleClass(document.body, 'custom-dark')
            }
            if (this.lightOrBlack === '2') {
                this.primaryColor = data.primary || '#409eff'
                this.colors.primary = data.primary || '#409eff'
                this.toggleClass(document.body, '')
            }
            this.writeNewStyle()
            this.$store
                .dispatch('authConfig/setUserTheme', {
                    id: this.$store.state.login.id,
                    workMode: this.lightOrBlack,
                    primaryColor: this.primaryColor,
                    primary: this.colors.primary,
                    isVertical: this.isVertical,
                    isCollapse: this.isCollapse,
                    menuDisplay: this.isVertical
                })
                .then(res => {
                    if (res.status !== Config.status.SUCCESS) {
                        Message.error({
                            showClose: true,
                            message: res.message
                        })
                    }
                })
        }, // 改变主题颜色
        submitForm() {
            this.dialogForm = false
            this.primaryColor = this.colors.primary
            this.lightOrBlack = '2'
            // this.colors = objectAssign({}, this.colors, generateColors(this.colors.primary))
            this.toggleClass(document.body, '')
            this.writeNewStyle()
            // this.$store.dispatch('authConfig/setUserTheme', {primaryColor:this.primaryColor,primary:this.colors.primary,isVertical:this.isVertical,isCollapse:this.isCollapse})
            this.$store
                .dispatch('authConfig/setUserTheme', {
                    id: this.$store.state.login.id,
                    themeColor: this.primaryColor,
                    isVertical: this.isVertical,
                    isCollapse: this.isCollapse,
                    workMode: this.lightOrBlack,
                    menuDisplay: this.isVertical,
                    primary: this.colors.primary
                })
                .then(res => {
                    if (res.status === Config.status.SUCCESS) {
                        Message.success({
                            showClose: true,
                            message: res.message
                        })
                    } else {
                        Message.error({
                            showClose: true,
                            message: res.message
                        })
                    }
                })
        },
        resetHandler() {
            this.colors.primary = '#409eff'
        }
    }
}
</script>
