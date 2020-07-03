<template>
    <div>
        <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
                <i class="icon icon-person" title="用户" style="font-size:20px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" append-to-body id="mask-box" width="600px">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="table-form table-form-pass">
                <el-form-item label="用户名:">
                    <el-input v-model="getUserName" autocomplete="off" type="text" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="旧密码:" prop="pass">
                    <el-input v-model="form.pass" autocomplete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" prop="newpass">
                    <el-input v-model="form.newpass" autocomplete="off" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="checkpass">
                    <el-input v-model="form.checkpass" autocomplete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updatePass">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios'
import { Message } from 'element-ui'
import JSEncrypt from '@/common/encrypt'
import Const from '@/common/const'
import BusinessUtil from '@/common/businessUtils'
import api from '@/common/api'
export default {
    name: 'edituser',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.form.checkpass !== '') {
                    this.$refs.form.validateField('checkpass')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.form.newpass) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            logoutUrl: api.getLogoutUrl(),
            dialogFormVisible: false,
            getUserName: this.$store.state.login.username,
            form: {
                name: '',
                pass: '',
                newpass: '',
                checkpass: ''
            },
            rules: {
                pass: [{ required: true, trigger: 'blur', message: '请输入密码' }],
                newpass: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    {
                        pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,24}$/,
                        message: '密码至少包含数字、大小写字母、特殊符号中的三种，6-24个字符，密码不能包含中文'
                    }
                ],
                checkpass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleCommand(command) {
            if (command === 'password') {
                this.dialogFormVisible = true
            } else {
                this.logout()
            }
        },
        logout() {
            this.$store.dispatch('login/logout').then(res => {
                if (res.status === Const.STATUS.SUCCESS) {
                    //remove cache
                    BusinessUtil.CallbackHandler(res, res)
                    localStorage.removeItem('vuex')
                    if (res.data) {
                        axios.post(res.data).then(res => {
                            res.status
                                ? this.$router.push({ path: '/', replace: true })
                                : Message.error({
                                      showClose: true,
                                      message: res.message
                                  })
                        })
                    } else {
                        if (this.logoutUrl) {
                            window.location.href = this.logoutUrl
                        } else {
                            this.$router.push({ path: '/', replace: true })
                        }
                    }
                } else {
                    Message.error({
                        showClose: true,
                        message: res.message
                    })
                }
            })
        },
        updatePass() {
            this.$refs['form'].validate(valid => {
                if (!valid) {
                    return false
                }
                this.$store.dispatch('login/getPasswordEncrypt').then(res => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        let data = {
                            userName: this.getUserName,
                            oldPassword: this.form.pass,
                            newPassword: this.form.newpass
                        }
                        if (res.data === 1) {
                            this.$store.dispatch('login/getPublicKey').then(response => {
                                if (response.status === Const.STATUS.SUCCESS) {
                                    let publicKey = response.data
                                    data.oldPassword = JSEncrypt.encrypt(data.oldPassword, publicKey)
                                    data.newPassword = JSEncrypt.encrypt(data.newPassword, publicKey)
                                    this.updatePassHandler(data)
                                } else {
                                    Message.error({
                                        showClose: true,
                                        message: res.message
                                    })
                                }
                            })
                        } else {
                            this.updatePassHandler(data)
                        }
                    }
                })
                this.$refs['form'].clearValidate()
            })
        },
        updatePassHandler(data) {
            this.$store.dispatch('login/updatePass', data).then(res => {
                if (res.status === Const.STATUS.SUCCESS) {
                    Message.success({
                        showClose: true,
                        message: res.message
                    })
                    this.dialogFormVisible = false
                } else {
                    Message.error({
                        showClose: true,
                        message: res.message
                    })
                }
            })
        }
    }
}
</script>
