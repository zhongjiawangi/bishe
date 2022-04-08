<template>
    <div class="no-family">
        <h1>家庭管理</h1>
        <el-divider></el-divider>
        <!-- 家主 -->
        <div
            v-if="$store.state.userinfo.rolename === '家主'"
            style="text-align: center"
        >
            <el-button type="text" @click="dialogVisible = true"
                >创建家庭</el-button
            >
            <el-dialog
                title="你是家主，请创建家庭"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="cancel"
            >
                <el-input
                    v-model="address"
                    placeholder="请输入家庭地址"
                    clearable
                ></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addHouse"
                        >确 定</el-button
                    >
                </span>
            </el-dialog>
        </div>
        <!-- 用户 -->
        <div v-if="$store.state.userinfo.rolename === '用户'">
            <h5>你还未绑定家庭，请先绑定</h5>
            <el-form
                :model="ruleForm"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
                :rules="rules"
            >
                <el-form-item label="绑定家庭" prop="username_master">
                    <el-input
                        type="age"
                        v-model.number="ruleForm.username_master"
                        autocomplete="off"
                        placeholder="请输入家主用户名"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')"
                        >绑定</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { MessageBox, Message } from 'element-ui'
export default {
    name: 'NoFamily',
    data() {
        var cheakUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入家主用户名'))
            } else if (value !== '') {
                this.searchMsater().then((res) => {
                    if (res.data.status !== 200) {
                        callback(new Error(res.data.message))
                    } else {
                        const { data: result } = res
                        const { data } = result
                        this.masterInfo = data
                        callback()
                    }
                })
            } else {
                callback()
            }
        }
        return {
            dialogVisible: true,
            address: '',
            masterInfo: {},
            ruleForm: {
                username_master: '',
            },
            rules: {
                username_master: [
                    { validator: cheakUser, trigger: 'blur' },
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
        cancel() {
            this.address = ''
            this.dialogVisible = false
        },
        addHouse() {
            const obj = {
                address: this.address,
            }
            this.$api.familyAPI.addHouse(obj).then((res) => {
                if (res.data.status === 200) {
                    Message({
                        type: 'success',
                        message: '创建成功',
                    })
                    this.$store.dispatch('getUserInfo')
                } else {
                    Message({
                        type: 'error',
                        message: res.message,
                    })
                }
                this.cancel()
            })
        },
        async searchMsater() {
            const username = this.ruleForm.username_master
            return await this.$api.userAPI.searchUser({ username })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    MessageBox.confirm(
                        `你要绑定的家庭的家主真实姓名为:  ${this.masterInfo.realname} `,
                        '确认信息',
                        {
                            confirmButtonText: '绑定',
                            cancelButtonText: '放弃绑定',
                        }
                    )
                        .then(() => {
                            const data = {
                                houseid: this.masterInfo.houseid,
                            }
                            this.$api.userAPI.bindHouse(data).then((result) => {
                                const { data: res } = result
                                if (res.status === 200) {
                                    Message({
                                        type: 'success',
                                        message: '绑定成功',
                                    })
                                    this.$store.dispatch('getUserInfo')
                                } else {
                                    Message({
                                        type: 'error',
                                        message: res.message,
                                    })
                                }
                            })
                        })
                        .catch(() => {
                            this.resetForm('ruleForm')
                            Message({
                                type: 'info',
                                message: '放弃绑定',
                            })
                        })
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.houseid = ''
            this.masterInfo = {}
            this.$refs[formName].resetFields()
        },
    },
}
</script>

<style lang="less" scoped>
.no-family {
    h1 {
        margin: 0 40px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        background-color: #fff;
    }
    h5 {
        text-align: center;
        font-size: 18px;
        color: rgb(238, 102, 102);
    }
    .el-form {
        width: 500px;
        position: relative;
        left: 50%;
        margin-top: 50px;
        transform: translate(-50%);
    }
}
</style>
