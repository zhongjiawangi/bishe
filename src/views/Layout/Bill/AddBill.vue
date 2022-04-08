<template>
    <div class="addbill">
        <!-- 面包屑 -->
        <!-- <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }"
                    >首页</el-breadcrumb-item
                >
                <el-breadcrumb-item :to="{ name: 'bill_out' }"
                    >支出详情</el-breadcrumb-item
                >
                <el-breadcrumb-item :to="{ name: 'add_bill_out' }"
                    >添加账单</el-breadcrumb-item
                >
            </el-breadcrumb>
        </div> -->
        <el-page-header @back="goback" content="添加账单"> </el-page-header>
        <!-- 表单 -->

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
                        <el-option
                            label="支出"
                            value="支出"
                            disabled
                        ></el-option>
                        <el-option
                            label="收入"
                            value="收入"
                            disabled
                        ></el-option>
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
                        >立即添加</el-button
                    >
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui'
export default {
    name: 'AddBill',
    data() {
        return {
            ruleForm: {
                title: '',
                money: '',
                remark: '',
                payway: '',
                name: '',
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
                typeid: {
                    required: true,
                    message: '请选择账单类型',
                },
            },
        }
    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        submitForm(formName) {
            this.$refs[formName].validate(async (valid) => {
                if (valid) {
                    const { data: res } = await this.$api.userAPI.addBill(
                        this.ruleForm
                    )
                    if (res.status === 201) {
                        Message({ message: '添加成功', type: 'success' })
                    } else {
                        Message({ message: '添加失败', type: 'error' })
                    }
                    this.resetForm(formName)
                } else {
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
    },
    created() {
        this.ruleForm.name = localStorage.getItem('name')
    },
}
</script>

<style lang="less" scoped>
.breadcrumb {
    background-color: #fff;
    margin-bottom: 20px;
    .el-breadcrumb {
        height: 30px;
        line-height: 30px;
        margin-left: 10px;
    }
}
.addbill {
    padding: 0 30px;
}
.myform {
    background-color: #fff;
    padding: 20px;
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
    .el-input,
    .el-textarea {
        min-width: 500px;
    }
}
</style>
