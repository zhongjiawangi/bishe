<template>
    <div class="login-container">
        <b id="title">家庭财务管理系统</b>
        <div class="left"></div>
        <el-card class="right" shadow="always">
            <h1>Login</h1>
            <el-form
                :model="loginForm"
                status-icon
                :rules="rules"
                ref="loginForm"
                label-width="100px"
                class="demo-ruleForm"
                @keyup.enter.native="submitForm('loginForm')"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        autocomplete="off"
                        clearable
                    ></el-input>
                </el-form-item>

                <el-form-item class="btn-box">
                    <el-button type="primary" @click="submitForm('loginForm')"
                        >登录</el-button
                    >
                    <el-button @click="register">注册</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'Login',
    data() {
        var checkAdmin = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                password: '',
                username: '',
            },
            rules: {
                password: [{ validator: validatePass, trigger: 'blur' }],
                username: [
                    { validator: checkAdmin, trigger: 'blur' },
                    {
                        min: 2,
                        max: 12,
                        message: '长度在 2 到 12 个字符',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const { data: res } = await this.$api.userAPI.Login(
                        this.loginForm
                    )
                    if (res.status === 200) {
                        Message({
                            message: '登录成功',
                            type: 'success',
                        })
                        localStorage.setItem('token', res.token)
                        setTimeout(() => {
                            this.$router.push({ name: 'home' })
                        }, 2000)
                    } else {
                        Message({
                            message: '用户名或密码错误',
                            type: 'error',
                        })
                        this.loginForm = {
                            password: '',
                            username: '',
                        }
                    }
                } else {
                    return false
                }
            })
        },
        register() {
            this.$router.push({ name: 'register' })
        },
    },
}
</script>

<style lang="less" scoped>
.login-container {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 60%;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    .left {
        background-image: url('@/assets/bg.svg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 0 60px;
        height: 100%;
        flex: 1;
    }
    .right {
        height: 60%;
        min-height: 300px;
        min-width: 350px;
        flex: 1;
        h1 {
            text-align: center;
            height: 60px;
        }
        /deep/ .el-input {
            width: 70%;
            min-width: 150px;
            left: 0;
        }
    }
}
#title {
    position: absolute;
    top: -15%;
    font-size: 32px;
}
</style>
