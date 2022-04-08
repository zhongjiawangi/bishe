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
                <el-form-item label="账单标题" autosize prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="账单金额" prop="money">
                    <el-input v-model.number="ruleForm.money"></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="payway">
                    <el-select
                        v-model="ruleForm.payway"
                        placeholder="请选择支付方式"
                    >
                        <el-option label="支付宝" value="支付宝"></el-option>
                        <el-option label="微信" value="微信"></el-option>
                        <el-option label="现金" value="现金"></el-option>
                        <el-option label="银联" value="银联"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账单类型" prop="name">
                    <el-select
                        v-model="ruleForm.name"
                        placeholder="请选择账单类型"
                    >
                        <el-option label="支出" value="支出" disabled></el-option>
                        <el-option label="收入" value="收入" disabled></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账单备注">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        resize="none"
                        v-model="ruleForm.remark"
                    ></el-input>
                </el-form-item>

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
    data() {
        return {
            dialogVisible: false,
            tit: '',
            ruleForm: {
            },
            rules: {
                title: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur',
                    },
                ],
                money: [
                    {
                        required: true,
                        message: '请输入金额',
                        trigger: 'blur',
                    },
                    { type: 'number', message: '金额必须为数字值' },
                ],
                payway: [
                    {
                        required: true,
                        message: '请选择支付方式',
                        trigger: 'change',
                    },
                ],
                type: {
                    required: true,
                    message: '请选择账单类型',
                },
            },
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                  this.reCheck()
                } else {
                    return this.dialogVisible = false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        reCheck () {
         MessageBox.confirm('此操作将修改该账单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                  this.dialogVisible = false
                  const { title,money,payway,remark} = this.ruleForm
                  this.$api.userAPI.updateBill(this.ruleForm)
                    Message({
                        type: 'success',
                        message: '修改成功!',
                    })
                })
                .catch(() => {
                  this.dialogVisible = false
                    Message({
                        type: 'info',
                        message: '已取消修改',
                    })
                })
        }
    },
}
</script>

<style lang='less' scoped></style>
