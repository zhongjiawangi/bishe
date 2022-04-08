<template>
    <div class="family">
        <h1>家庭成员信息</h1>
        <el-divider></el-divider>
            <div style=" margin:20px 40px">
              <el-table :data="familyData" border stripe ref="mytable">
                <el-table-column type="index" label="序号" width="100" :resizable="false">
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="姓名"
                    width="200"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="rolename"
                    label="角色"
                    :resizable="false"
                    width="150"
                >
                </el-table-column>
                <el-table-column prop="address" label="地址" :resizable="false">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="200"
                    v-if="$store.state.userinfo.rolename !== '用户'"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="warning"
                            size="medium"
                            @click="transfer(scope.row)"
                            >转让家主</el-button
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
            </div>
        <div class="btn-box">
            <el-button
                type="text"
                @click="Edit"
                v-if="$store.state.userinfo.rolename !== '用户'"
                >修改家庭地址</el-button
            >
            <el-button @click="exitHouse">退出家庭</el-button>
        </div>
        <FamilyDialog ref="myDialog" @changeAddress="getFamilyInfo" />
    </div>
</template>

<script>
import FamilyDialog from '@/components/FamilyDialog.vue'
import { MessageBox, Message } from 'element-ui'
export default {
    name: 'FamilyManage',
    components: {
        FamilyDialog,
    },
    data() {
        return {
            familyData: [],
        }
    },
    methods: {
        /**
         * 退出家庭
         */
        exitHouse() {
            if (this.$store.state.userinfo.rolename === '家主') {
                return MessageBox.alert(
                    '您是家主不能直接退出家庭，请先转让家主',
                    '错误',
                    {
                        confirmButtonText: '确定',
                        type: 'warning',
                    }
                )
            }
            MessageBox.confirm('是否确定退出家庭?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$api.userAPI.exitHouse().then((result) => {
                        const { data: res } = result
                        if (res.status === 200) {
                            Message({
                                type: 'success',
                                message: '退出成功!',
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
                    Message({
                        type: 'info',
                        message: '已取消',
                    })
                })
        },
        /**
         * 获取家庭信息
         */
        async getFamilyInfo() {
            const { data: res } = await this.$api.familyAPI.getFamilyInfo({id:this.$store.state.userinfo.houseid})
            this.familyData = res.data
            console.log(res.data);
        },
        /**
         * 转让家主
         */
        transfer(row) {
            MessageBox.confirm('是否确定将家主转给该成员?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    const oldMasterId = row.ownerid
                    const newMasterId = row.id
                    if (oldMasterId === newMasterId) {
                        return Message({
                            type: 'error',
                            message: '不能向同一个人转让家主!',
                        })
                    }
                    const houseid = row.houseid
                    const data = { oldMasterId, newMasterId, houseid }
                    this.$api.familyAPI.changeMaster(data).then((result) => {
                        const { data: res } = result
                        if (res.status === 200) {
                            setTimeout(() => {
                                localStorage.removeItem('token')
                                this.$router.push({ name: 'login' })
                            }, 1000)
                            Message({
                                type: 'success',
                                message: '转让成功!请重新登陆',
                            })
                        }
                    })
                })
                .catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消转让',
                    })
                })
        },
        /**
         * 删除操作
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
        /**
         * 编辑操作
         */
        Edit() {
            this.$refs.myDialog.dialogVisible = true
        },
    },
    created() {
        this.getFamilyInfo()
    },
}
</script>

<style lang="less" scoped>
.family {
    h1 {
      margin: 0 40px;
        text-align: center;
        background-color: #fff;
        height: 60px;
        line-height: 60px;
    }
    .el-table {
        /deep/.cell {
            text-align: center;
        }
    }
    .btn-box {
        margin-top: 50px;
        text-align: center;
    }
}
</style>
