<template>
    <el-dialog
        title=""
        :visible.sync="dialogVisible"
        width="60%"
        :before-close="reset"
    >
        <!-- 表格区域 -->
        <el-table :data="$store.state.family" border stripe ref="mytable">
            <el-table-column
                type="index"
                label="序号"
                width="80"
                :resizable="false"
            >
            </el-table-column>
            <el-table-column
                prop="realname"
                label="姓名"
                width="140"
                :resizable="false"
            >
            </el-table-column>
            <el-table-column
                prop="rolename"
                label="角色"
                :resizable="false"
                width="140"
            >
            </el-table-column>
            <el-table-column prop="address" label="地址" :resizable="false">
            </el-table-column>
            <el-table-column
                label="操作"
                v-if="$store.state.userinfo.rolename !== '用户'"
            >
                <template slot-scope="scope">
                    <el-button size="medium" @click="transfer(scope.row)"
                        >设为家主</el-button
                    >
                    <el-button
                        icon="el-icon-delete"
                        size="medium"
                        type="danger"
                        circle
                        @click="Delete(scope.row)"
                    ></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center; margin-top: 10px">
            <el-button type="text" size="medium" @click="innerVisible = true"
                >修改地址</el-button
            >
            <br />
            <el-button type="text" size="medium" @click="memberVisible = true"
                >添加新成员</el-button
            >
        </div>
        <!-- 内置对话框 -->
        <!-- 修改地址 -->
        <el-dialog
            width="30%"
            title="修改地址"
            :visible.sync="innerVisible"
            append-to-body
            :before-close="handleClose"
        >
            <el-input placeholder="请输入新地址" v-model="address" clearable>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button
                    type="primary"
                    @click="changeAddress"
                    :disabled="address ? false : true"
                    >确 定</el-button
                >
            </span>
        </el-dialog>
        <!-- 添加成员 -->
        <el-dialog
            width="30%"
            title="添加成员"
            :visible.sync="memberVisible"
            append-to-body
            :before-close="handleClose"
        >
            <el-input placeholder="请输入用户名" v-model="username" clearable>
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" :disabled="username ? false : true"
                @click="addMember"
                    >确 定</el-button
                >
            </span>
        </el-dialog>

        <span slot="footer" class="dialog-footer">
            <el-button @click="reset">取 消</el-button>
            <el-button type="primary" @click="reset">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { Message, MessageBox } from 'element-ui'

export default {
    name: 'FamileDialog',
    data() {
        return {
            dialogVisible: false,
            innerVisible: false,
            memberVisible: false,
            address: '',
            username: '',
        }
    },
    methods: {
        /**
         * 添加成员
         */
        addMember() {
            const obj = {
                houseid: this.$store.state.family[0].houseid,
                username: this.username,
            }
            this.$api.userAPI.bindHouse(obj).then((result) => {
                const { data: res } = result
                if (res.status === 200) {
                    Message({
                        type: 'success',
                        message: '添加成功',
                    })
                    // 更新家庭信息
                    this.$store.dispatch('getFamilyInfo', {
                        id: obj.houseid,
                    })
                    this.$emit('change')
                } else {
                    Message({
                        type: 'error',
                        message: res.message,
                    })
                }
                this.memberVisible = false
                this.username = ''
            })
        },
        /**
         * 修改地址
         */
        changeAddress() {
            const object = {
                address: this.address,
                houseid: this.$store.state.family[0].houseid,
            }
            this.$api.familyAPI.changeAddress(object).then((result) => {
                if (result.data.status === 200) {
                    Message({
                        type: 'success',
                        message: '修改成功',
                    })
                    this.$store.dispatch('getFamilyInfo', {
                        id: object.houseid,
                    })
                    this.$emit('change')
                } else {
                    Message({
                        type: 'error',
                        message: result.data.message,
                    })
                }
                this.innerVisible = false
                this.address = ''
            })
        },
        /**
         * 转让家主
         */
        transfer(row) {
            if (row.id === row.ownerid) {
                return Message({
                    type: 'error',
                    message: '不能向同一个人转让家主!',
                })
            }
            const oldMasterId = row.ownerid
            const newMasterId = row.id
            const houseid = row.houseid
            const data = { oldMasterId, newMasterId, houseid }
            this.$api.familyAPI.changeMaster(data).then((result) => {
                const { data: res } = result
                if (res.status === 200) {
                    this.$emit('change')
                    Message({
                        type: 'success',
                        message: res.message,
                    })
                } else {
                    Message({
                        type: 'error',
                        message: res.message,
                    })
                }
                this.dialogVisible = false
            })
        },
        /**
         * 删除成员
         */
        Delete(row) {
            if (row.id === row.ownerid) {
                return Message({
                    type: 'error',
                    message: '该用户是家主请先转让家主!',
                })
            }
            MessageBox.confirm(
                '此操作将从你的家庭里删除该成员, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            )
                .then(() => {
                    this.$api.familyAPI
                        .deleteMember({ id: row.id })
                        .then((res) => {
                            if (res.data.status === 200) {
                                Message({
                                    type: 'success',
                                    message: '删除成功!',
                                })
                            } else {
                                Message({
                                    type: 'success',
                                    message: res.data.message,
                                })
                            }
                            this.dialogVisible = false
                        })
                })
                .catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
        handleClose() {
            this.address = ''
            this.username = ''
            this.innerVisible = false
            this.memberVisible = false
        },
        reset() {
            this.dialogVisible = false
        },
    },
}
</script>

<style lang="less" scoped>
.el-table {
    /deep/.cell {
        text-align: center;
    }
}
</style>
