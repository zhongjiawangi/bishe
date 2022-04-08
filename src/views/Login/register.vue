<template>
    <div class="login-container">
        <div class="left"></div>
        <el-card class="right" shadow="always">
            <div class="backlogin">
                <el-button
                    type="primary"
                    icon="el-icon-back"
                    @click="back"
                ></el-button>
            </div>
            <h1>Register</h1>
            <el-form
                :model="registerForm"
                status-icon
                :rules="rules"
                ref="registerForm"
                label-width="100px"
                :hide-required-asterisk="true"
                class="demo-ruleForm"
            >
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="registerForm.password"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input
                        type="password"
                        v-model="registerForm.checkPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="真实名字" prop="realname">
                    <el-input v-model="registerForm.realname"></el-input>
                </el-form-item>
                <el-form-item label="账号类型" prop="rolename">
                    <el-select
                        v-model="registerForm.rolename"
                        placeholder="请选择账号类型"
                    >
                        <el-option label="家主" value="家主"></el-option>
                        <el-option label="用户" value="用户"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="btn-box">
                    <el-button
                        type="primary"
                        @click="submitForm('registerForm')"
                        >注册</el-button
                    >
                    <el-button @click="resetForm('registerForm')"
                        >重置</el-button
                    >
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
export default {
    name: 'Register',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.registerForm.checkPass !== '') {
                    this.$refs.registerForm.validateField('checkPass')
                }
                callback()
            }
        }
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不一致!'))
            } else {
                callback()
            }
        }

        return {
            registerForm: {
                password: '',
                checkPass: '',
                username: '',
                realname: '',
                rolename: '',
            },
            rules: {
                password: [
                    { validator: validatePass, trigger: 'blur' },
                    {
                        min: 3,
                        max: 16,
                        message: '长度在 3 到 16 个字符',
                        trigger: 'blur',
                    },
                ],
                checkPass: [{ validator: validatePass2, trigger: 'blur' }],
                username: [
                    {
                        required: true,
                        type: 'string',
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    {
                        min: 2,
                        max: 12,
                        message: '长度在 2 到 12 个字符',
                        trigger: 'blur',
                    },
                ],
                realname: [
                    {
                        required: true,
                        type: 'string',
                        message: '请输入真实姓名',
                        trigger: 'blur',
                    },
                    {
                        min: 2,
                        max: 10,
                        message: '长度在 2 到 10 个字符',
                        trigger: 'blur',
                    },
                ],
                rolename: [
                    {
                        required: true,
                        message: '请选择账号类型',
                        trigger: 'change',
                    },
                ],
                address: [
                    {
                        required: true,
                        type: 'string',
                        message: '请输入家庭地址',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        async searchMsater() {
            const username = this.registerForm.username_master
            return await this.$api.userAPI.searchUser({ username })
        },
        async searchUser(params) {
            const { date: res } = await this.$api.userAPI.searchUser(params)
            return res
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const { data: res } = await this.$api.userAPI.Register(
                        this.registerForm
                    )
                    if (res.status == 201) {
                        Message({
                            showClose: true,
                            message: '注册成功,即将跳转登录界面',
                            type: 'success',
                        })
                        setTimeout(() => {
                            this.$router.push({ name: 'login' })
                        }, 1500)
                    } else {
                        Message({
                            showClose: true,
                            message: res.message,
                            type: 'error',
                        })
                    }
                    this.resetForm('registerForm')
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        back() {
            this.$router.push({ name: 'login' })
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
    // background-color: pink;
    .left {
        background-image: url('@/assets/bg.svg');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: 0 60px;
        height: 100%;
        flex: 1;
    }
    .right {
        // height: 60%;
        min-height: 350px;
        min-width: 350px;
        flex: 1;
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        /deep/ .el-input {
            width: 70%;
            min-width: 150px;
            left: 0;
        }
        .btn-box {
            display: flex;
            justify-content: flex-start;
        }
    }
}
.backlogin {
    position: absolute;
}
</style>
