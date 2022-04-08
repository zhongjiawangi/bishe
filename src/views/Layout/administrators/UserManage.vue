<template>
    <div class="user-manage">
        <h1>用户管理</h1>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="search.username" placeholder="用户名"></el-input>
            <el-input
                v-model="search.realname"
                placeholder="真实姓名"
            ></el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-divider></el-divider>
        <!-- 表格 -->
        <div class="tableDate">
            <el-table :data="userData" max-height="600" stripe border>
                <el-table-column
                    type="index"
                    label="序号"
                    width="100"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名"
                    width="250"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="真实姓名"
                    width="200"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="rolename"
                    label="角色"
                    width="150"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址"
                    show-overflow-tooltip
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="200"
                    :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button
                            @click="handleClick(scope.row)"
                            type="text"
                            size="small"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            @click="delUser(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 修改用户信息 -->
        <UserDialog ref="userDialog" tit="修改用户信息" />
    </div>
</template>

<script>
import UserDialog from '@/components/UserDialog.vue'
import { Message, MessageBox } from 'element-ui'

export default {
    name: 'UserManage',
    components: {
        UserDialog,
    },
    data() {
        return {
            userData: [],
            search: {
                username: '',
                realname: '',
            },
        }
    },
    methods: {
        handleClick(row) {
            this.$refs.userDialog.dialogVisible = true
            this.$refs.userDialog.ruleForm = row
        },
        delUser(row) {
            if (row.rolename !== '用户') {
                return Message({
                    type: 'error',
                    message: '该用户是家主，请先转让家主',
                })
            }
            MessageBox.confirm('此操作将修改该账号, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$api.adminAPI
                        .deleteUser({ id: row.id })
                        .then((result) => {
                            if (result.data.status === 200) {
                                Message({
                                    type: 'success',
                                    message: '修改成功!',
                                })
                            } else {
                                Message({
                                    type: 'error',
                                    message: result.data.message,
                                })
                            }
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
    created() {
        this.$api.adminAPI.getUsers().then((result) => {
            if (result.data.status === 200) {
                this.userData = result.data.data
            }
        })
    },
}
</script>

<style lang="less" scoped>
.user-manage {
    h1 {
        margin: 0 40px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        background-color: #fff;
    }
    .search {
        margin: 20px;
        display: flex;
        justify-content: flex-end;
        .el-input {
            max-width: 200px;
            margin-right: 30px;
        }
        button {
            margin-right: 100px;
        }
    }
    .tableDate {
        padding: 0 20px;
        margin: 20px;
        .el-table {
            /deep/.cell {
                text-align: center;
            }
        }
    }
    .el-divider {
      margin: 0;
    }
}
</style>
