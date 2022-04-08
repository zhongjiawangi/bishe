<template>
    <el-dialog :title="tit" :visible.sync="dialogVisible" width="30%">
        <div class="myform">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="用户名" autosize prop="username">
                    <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model.number="ruleForm.password"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realname">
                    <el-input v-model.number="ruleForm.realname"></el-input>
                </el-form-item>
                <!-- <el-form-item label="角色" prop="rolename">
                    <el-select
                        v-model="ruleForm.rolename"
                        placeholder="请选择角色"
                    >
                        <el-option label="家主" value="家主" ></el-option>
                        <el-option label="用户" value="用户" ></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')"
                        >立即修改</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
                >确 定</el-button
            >
        </span>
    </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
export default {
    props: {
        tit: {
            default: '',
            type: String,
        },
    },
    data() {
        return {
            dialogVisible: false,
            ruleForm: {},
            rules: {
                username: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur',
                    },
                    { type: 'string', message: '用户名必须为字符串' },
                ],
                realname: [
                    {
                        required: true,
                        message: '请输入真实姓名',
                        trigger: 'blur',
                    },
                    { type: 'string', message: '真实姓名必须为字符串' },
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur',
                    },
                ],
                rolename: [
                    {
                        required: true,
                        message: '请选择角色',
                        trigger: 'change',
                    },
                ],
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    this.reCheck()
                } else {
                    return (this.dialogVisible = false)
                }
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
</style>
