<template>
    <el-dialog title="修改信息" :visible.sync="dialogVisible" width="30%">
        <div class="myform">
            <el-button @click="usernameVisible = true" type="primary" plain
                >修改用户名</el-button
            >
            <el-button @click="realnameVisible = true" type="primary" plain
                >修改姓名</el-button
            >
            <el-button @click="pwdVisible = true" type="primary" plain
                >修改密码</el-button
            >

            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <!-- 修改用户名 -->
                <div class="username">
                    <el-dialog
                        width="30%"
                        title="修改用户名"
                        :visible.sync="usernameVisible"
                        append-to-body
                        style="text-align: center"
                        :before-close="handleClose"
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="ruleForm.username"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="changeUsername"
                            >确 定</el-button
                        >
                    </el-dialog>
                </div>

                <!-- 修改姓名 -->
                <div class="realname">
                    <el-dialog
                        width="30%"
                        title="修改姓名"
                        :visible.sync="realnameVisible"
                        append-to-body
                        style="text-align: center"
                        :before-close="handleClose"
                    >
                        <el-form-item label="真实姓名" prop="realname">
                            <el-input v-model="ruleForm.realname"></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="changeRealname"
                            >确 定</el-button
                        >
                    </el-dialog>
                </div>

                <!-- 修改密码 -->
                <div class="pwd">
                    <el-dialog
                        width="30%"
                        title="修改密码"
                        :visible.sync="pwdVisible"
                        style="text-align: center"
                        append-to-body
                        :before-close="handleClose"
                    >
                        <el-form-item label="原密码" prop="oldPWD">
                            <el-input
                                v-model.number="ruleForm.oldPWD"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" prop="password">
                            <el-input
                                v-model.number="ruleForm.password"
                                show-password
                            ></el-input>
                        </el-form-item>
                        <el-button type="primary" @click="changePwd"
                            >确 定</el-button
                        >
                    </el-dialog>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'InfoDialog',
    data() {
        return {
            dialogVisible: false,
            realnameVisible: false,
            usernameVisible: false,
            pwdVisible: false,
            ruleForm: {
                username: '',
                oldPWD: '',
                realname: '',
                password: '',
            },
            rules: {
                realname: [
                    {
                        required: true,
                        message: '请输入真实姓名',
                        trigger: 'blur',
                    },
                ],
                oldPWD: [
                    {
                        required: true,
                        message: '请输入原密码',
                        trigger: 'blur',
                    },
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                ],
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                ],
            },
        }
    },
    methods: {
        handleClose() {
            this.ruleForm = {
                oldPWD: '',
                realname: '',
                password: '',
            }
            this.realnameVisible = false
            this.pwdVisible = false
            this.usernameVisible = false
        },
        /**
         * 修改用户名
         */
        changeUsername() {
            this.$api.userAPI
                .uodateUserInfo({ username: this.ruleForm.username })
                .then((res) => {
                    if (res.data.status === 200) {
                        Message({
                            type: 'success',
                            message: '修改成功!请重新登录',
                        })
                        setTimeout(() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('rolename')
                            this.$router.push({ name: 'login' })
                        }, 1000)
                    } else {
                        Message({
                            type: 'error',
                            message: res.data.message,
                        })
                    }
                    this.realnameVisible = false
                })
        },
        /**
         * 修改姓名
         */
        changeRealname() {
            this.$api.userAPI
                .uodateUserInfo({ realname: this.ruleForm.realname })
                .then((res) => {
                    if (res.data.status === 200) {
                        Message({
                            type: 'success',
                            message: '修改成功!',
                        })
                    } else {
                        Message({
                            type: 'error',
                            message: res.data.message,
                        })
                    }
                    this.$store.dispatch('getUserInfo')
                    this.realnameVisible = false
                })
        },
        /**
         * 修改密码
         */
        changePwd() {
            const obj = {
                oldpassword: this.ruleForm.oldPWD,
                password: this.ruleForm.password,
            }
            this.$api.userAPI.uodateUserInfo(obj).then((res) => {
                if (res.data.status === 200) {
                    Message({
                        type: 'success',
                        message: '修改成功!',
                    })
                    setTimeout(() => {
                        localStorage.removeItem('token')
                        localStorage.removeItem('rolename')
                        this.$router.push({ name: 'login' })
                    }, 1000)
                } else {
                    Message({
                        type: 'error',
                        message: res.data.message,
                    })
                }
                this.pwdVisible = false
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        reCheck() {
            MessageBox.confirm('此操作将修改信息, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.dialogVisible = false
                    const obj = {
                        id: this.ruleForm.id,
                        username: this.ruleForm.username,
                        password: this.ruleForm.password,
                        realname: this.ruleForm.realname,
                    }
                    this.$api.adminAPI.editUser(obj).then((res) => {
                        if (res.data.status === 200) {
                            Message({
                                type: 'success',
                                message: '修改成功!',
                            })
                        } else {
                            Message({
                                type: 'error',
                                message: res.data.message,
                            })
                        }
                        this.dialogVisible = false
                    })
                })
                .catch(() => {
                    this.dialogVisible = false
                    Message({
                        type: 'info',
                        message: '已取消修改',
                    })
                })
        },
    },
}
</script>

<style lang="less" scoped>
.el-input {
    width: 70%;
}
.myform {
    text-align: center;
}
/deep/.el-form-item__content {
    margin: 0 !important;
}
</style>
