<template>
    <div class="family-manage">
        <h1>家庭管理</h1>
        <!-- 搜索 -->
        <div class="search">
            <el-input v-model="search.username" placeholder="用户名"></el-input>
            <el-input v-model="search.address" placeholder="地址"></el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
        </div>
        <el-divider></el-divider>
        <!-- 表格 -->
        <div class="box">
            <el-table :data="familyData" max-height="600" stripe border>
                <el-table-column
                    type="index"
                    label="序号"
                    width="100"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="家主用户名"
                    width="250"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="家主姓名"
                    width="200"
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
                    prop="id"
                    label="家庭编号"
                    width="150"
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
                            @click="editHouse(scope.row)"
                            type="text"
                            size="small"
                            >编辑</el-button
                        >
                        <el-button
                            type="text"
                            size="small"
                            @click="delHouse(scope.row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 编辑家庭 -->
        <FamiliesDialog ref="familiesDialog" @change="getFamily"/>
    </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import FamiliesDialog from '@/components/FamiliesDialog.vue'

export default {
    name: 'RoleManage',
    components: {
        FamiliesDialog,
    },
    data() {
        return {
            search: {
                username: '',
                address: '',
            },
            familyData: [],
        }
    },
    methods: {
      /**
       * 编辑家庭
       */
        editHouse(data) {
            this.$store.dispatch('getFamilyInfo', { id: data.id })
            this.$refs.familiesDialog.dialogVisible = true
        },
        /**
         * 删除家庭
         */
        delHouse(id) {
            MessageBox.confirm('此操作将删除该家庭, 是否继续?', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    this.$api.adminAPI.deleteHouse({ id }).then((result) => {
                        if (result.data.status === 200) {
                          this.getFamily()
                            Message({
                                type: 'success',
                                message: result.data.message,
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
                        message: '已取消删除',
                    })
                })
        },
        /**
         * 获取家庭列表
         */
        getFamily() {
            this.$api.adminAPI.getFamilies().then((res) => {
                if (res.data.status !== 200) {
                    return
                }
                this.familyData = res.data.data
            })
        },
    },
    created() {
      this.getFamily()
    },
}
</script>

<style lang="less" scoped>
.family-manage {
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
    .el-table {
        /deep/.cell {
            text-align: center;
        }
    }
    .el-divider {
        margin: 0;
    }
    .box {
        padding: 0 20px;
        margin: 20px;
    }
}
</style>
