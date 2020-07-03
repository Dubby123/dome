<template>
    <el-container class="container-box">
        <el-header><img src="../../assets/img/logo_knowledge.png"/></el-header>
        <section class="main-box">
            <div class="register-header">{{ type ? '找回密码' : '注册知识中心账号' }}</div>
            <el-steps :active="activeStep" process-status="finish" align-center>
                <el-step :title="type ? '身份验证' : '验证邮箱'" :class="{ steped: activeStep > 0 }"></el-step>
                <el-step :title="type ? '重置密码' : '填写账号信息'" :class="{ steped: activeStep > 1 }"></el-step>
                <el-step :title="type ? '完成密码重置' : '注册成功'" :class="{ steped: activeStep > 2 }"></el-step>
            </el-steps>
            <div class="forms-box">
                <el-form ref="form" :model="form" :rules="rules" v-show="activeStep === 0">
                    <el-form-item prop="account">
                        <el-input v-model="form.account" :placeholder="type === 'phone' ? '请输入手机账号' : '请输入邮箱账号'" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                        <el-input v-model="form.captcha" placeholder="请输入验证码" @keyup.enter.native="loginHandler" clearable>
                            <template slot="append">
                                <img class="authCode-img" @click="authCode" :src="authCodeImg" alt="图片加载失败" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="dynamicCaptcha" class="emailCode">
                        <el-input v-model="form.dynamicCaptcha" :placeholder="type === 'phone' ? '请输入手机验证码' : '请输入邮箱验证码'" clearable></el-input>
                        <el-button @click="sendAuthCode" :disabled="countDown !== 60"> {{ countDown === 60 ? '发送验证码' : countDown + 's' }} </el-button>
                    </el-form-item>
                    <el-button type="primary" @click="next">下一步</el-button>
                </el-form>
                <el-form ref="accountForm" :model="accountForm" :rules="accountRules" v-show="activeStep === 1">
                    <el-form-item v-if="!type" prop="username">
                        <el-input v-model="accountForm.username" placeholder="请输入用户名" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="newPassword">
                        <el-input type="password" v-model="accountForm.newPassword" placeholder="请输入密码" clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="rePassword">
                        <el-input type="password" v-model="accountForm.rePassword" placeholder="请再次输入密码" clearable></el-input>
                    </el-form-item>
                    <el-form-item v-if="!type" prop="mobile">
                        <el-input v-model="accountForm.mobile" placeholder="请输入手机号" clearable></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="registerAccount">{{ type ? '下一步' : '注册' }}</el-button>
                </el-form>
                <div class="tooltip-box" v-show="activeStep === 2">
                    <p>{{ type ? '恭喜您重置密码成功！' : '恭喜您已成功注册知识中心！' }}</p>
                    <p>
                        <span>{{ timer }}</span>
                        s后返回刚刚操作的界面
                    </p>
                </div>
            </div>
            <div class="return-login">
                <el-button type="text" @click="$router.push({ name: 'login' })">登录已有知识中心账号</el-button>
            </div>
        </section>
        <footer>Copyright © 2003-2020浙江浙大中控信息技术有限公司</footer>
    </el-container>
</template>
<script>
import Const from '@/common/const'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import JSEncrypt from '@/common/encrypt'

export default {
    name: 'register',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('登录密码不能为空！'))
            } else {
                if (this.accountForm.rePassword !== '') {
                    this.$refs.accountForm.validateField('rePassword')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('重复密码不能为空！'))
            } else if (value !== this.accountForm.newPassword) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            type: '',
            activeStep: 0,
            form: {
                account: '',
                captcha: '',
                dynamicCaptcha: '',
                type: ''
            },
            accountForm: {
                username: '',
                newPassword: '',
                rePassword: '',
                mobile: ''
            },
            countDown: 60,
            timer: 5,
            rules: {
                account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
                dynamicCaptcha: [{ required: true, message: '动态验证码不能为空', trigger: 'blur' }]
            },
            accountRules: {
                rePassword: [
                    { required: true, validator: validatePass2, trigger: 'blur' },
                    { min: 6, max: 32, message: '密码长度在6到32个字符之内', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 32, message: '密码长度在6到32个字符之内', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        ...mapGetters('login', {
            authCodeImg: 'getAuthCode'
        })
    },
    mounted() {
        this.authCode()
        this.type = this.$route.params.type ? this.$route.params.type : ''
    },
    methods: {
        next() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return false
                }
                if (this.type !== '') {
                    this.form.type = this.type === 'email' ? 1 : 0
                    this.$store.dispatch('register/userAuthentication', this.form).then(res => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.activeStep = 1
                        } else {
                            Message.error({
                                showClose: true,
                                message: res.message
                            })
                        }
                    })
                } else {
                    this.form.type = 1
                    this.$store.dispatch('register/registAuthentication', this.form).then(res => {
                        if (res.status === Const.STATUS.SUCCESS) {
                            this.activeStep = 1
                        } else {
                            Message.error({
                                showClose: true,
                                message: res.message
                            })
                        }
                    })
                }
                this.$refs.form.clearValidate()
            })
        },
        successHandler(res, cb) {
            if (res.status == Const.STATUS.SUCCESS) {
                Message.success({
                    showClose: true,
                    message: res.message
                })
                cb && cb()
            } else {
                Message.error({
                    showClose: true,
                    message: res.message
                })
            }
        },
        codeSendCutDown() {
            let that = this
            let interval = setInterval(function() {
                that.countDown--
                if (that.countDown === 0) {
                    clearInterval(interval)
                    that.countDown = 60
                }
            }, 1000)
        },
        sendAuthCode() {
            this.$refs.form.validateField('account', errorInfo => {
                if (errorInfo === '') {
                    let param = {
                        account: this.form.account,
                        type: 1
                    }
                    if (this.type !== '') {
                        param.type = this.type === 'email' ? 1 : 0
                        this.$store.dispatch('register/getEmailCode', param).then(res =>
                            this.successHandler(res, () => {
                                this.codeSendCutDown()
                            })
                        )
                    } else {
                        this.$store.dispatch('register/getRegisterEmailCode', param).then(res =>
                            this.successHandler(res, () => {
                                this.codeSendCutDown()
                            })
                        )
                    }
                }
            })
        },
        authCode() {
            this.$store.dispatch('login/getAuthCode')
        },
        autoJumpToLogin() {
            let that = this
            let interval = setInterval(function() {
                that.timer--
                if (that.timer === 0) {
                    that.$router.push({ name: 'login' })
                    clearInterval(interval)
                }
            }, 1000)
        },
        passwordPost() {
            if (this.type !== '') {
                this.form.newPassword = this.form.rePassword
                this.form.type = this.type === 'email' ? 1 : 0
                this.$store.dispatch('register/renewalPassword', this.form).then(res => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.activeStep = 2
                        this.autoJumpToLogin()
                    } else {
                        Message.error({
                            showClose: true,
                            message: res.message
                        })
                    }
                })
            } else {
                this.form.password = this.form.rePassword
                this.form.mobile = this.accountForm.mobile
                this.form.username = this.accountForm.username
                this.$store.dispatch('register/registerUser', this.form).then(res => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        this.activeStep = 2
                        this.autoJumpToLogin()
                    } else {
                        Message.error({
                            showClose: true,
                            message: res.message
                        })
                    }
                })
            }
        },
        registerAccount() {
            this.$refs.accountForm.validate(valid => {
                if (!valid) {
                    return false
                }
                this.form.rePassword = this.accountForm.rePassword
                this.form.type = 1
                this.$store.dispatch('login/getPasswordEncrypt').then(res => {
                    if (res.status === Const.STATUS.SUCCESS) {
                        if (res.data === 1) {
                            this.$store.dispatch('login/getPublicKey').then(response => {
                                if (response.status === Const.STATUS.SUCCESS) {
                                    let publicKey = response.data
                                    this.form.rePassword = JSEncrypt.encrypt(this.form.rePassword, publicKey)
                                    this.passwordPost()
                                } else {
                                    Message.error({
                                        showClose: true,
                                        message: res.message
                                    })
                                }
                            })
                        } else {
                            this.passwordPost()
                        }
                    }
                })
                this.$refs.accountForm.clearValidate()
            })
        }
    }
}
</script>

<style scopedSlots>
* {
    margin: 0;
    padding: 0;
}
html,
body,
#body {
    width: 100%;
    height: 100%;
}
body {
    font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
#body {
    overflow: auto;
}
#body > .container-box {
    height: 100%;
    min-width: 1000px;
    min-height: 550px;
    position: relative;
    overflow: hidden;
}
.container-box {
    width: 100%;
    background: #fff;
    position: relative;
}
.container-box .el-header {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}
.container-box .el-header img {
    height: 33px;
    padding: 14px 0;
}
.main-box {
    width: 50%;
    height: 100%;
    margin: 0 auto;
}
.register-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 28px;
    color: #333;
    font-family: '微软雅黑';
    text-align: center;
    margin: 5% 0;
}
.forms-box {
    width: 45%;
    height: calc(65% - 165px);
    min-height: 250px;
    position: relative;
    margin: 0 auto;
}
.forms-box .el-form {
    width: 100%;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.forms-box .el-input__inner {
    background-color: #fafafa;
    border-color: #f0f0f0;
    border-radius: 0;
}
.forms-box .el-form-item {
    margin-bottom: 20px;
}
.forms-box .el-button {
    width: 100%;
    border-radius: 0;
}
.tooltip-box p {
    line-height: 100px;
}
.tooltip-box p:first-child {
    font-size: 18px;
    text-align: center;
    color: #333;
}
.tooltip-box p:last-child {
    font-size: 16px;
    text-align: center;
    color: #bfbfbf;
}
.forms-box .el-input-group__append {
    width: 90px;
    padding: 0px;
    background-color: transparent;
    border-color: #f0f0f0;
    overflow: hidden;
    position: relative;
}
.forms-box .authCode-img {
    height: 106%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
}
.emailCode .el-input {
    width: calc(100% - 100px);
    margin-right: 5px;
    float: left;
}
.emailCode .el-button {
    width: 95px;
    float: left;
    padding: 12px;
}
.return-login {
    margin: -3% 0;
}
.return-login .el-button {
    width: 100%;
    text-align: center;
    margin: 20px;
}

/*step*/
.el-steps {
    margin: 10% 0 8%;
}
.el-step.is-center .el-step__line {
    left: 65%;
    right: -35%;
}
.el-step__head.is-finish {
    color: #fff;
}
.is-finish .el-step__icon {
    background: #409eff;
}
.el-step__title.is-wait {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
}
.el-step__title.is-finish {
    color: #000;
    font-size: 14px;
}
.el-step.steped .el-step__line {
    background-color: #409eff;
}
.container-box footer {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    position: absolute;
    bottom: 5px;
    text-align: center;
    width: 100%;
}
</style>
