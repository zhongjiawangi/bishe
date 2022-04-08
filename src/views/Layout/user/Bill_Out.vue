<template>
    <div class="bill_out">
        <h1>支出详情</h1>
        <!-- 搜索 -->
        <div class="header-out">
            <div style="margin-right: 20px">
                <el-date-picker
                    v-model="search.time"
                    type="datetimerange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </div>
            <el-input
                v-if="$store.state.userinfo.rolename !== '用户'"
                placeholder="姓名"
                v-model="search.realname"
                clearable
            ></el-input>
            <el-input
                placeholder="标题"
                v-model="search.title"
                clearable
            ></el-input>
            <el-select v-model="search.payway" clearable placeholder="支付方式">
                <el-option
                    v-for="item in payways"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
            <el-input
                placeholder="备注"
                v-model="search.remark"
                clearable
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="onSearch"
                >查询</el-button
            >
            <el-button type="primary" icon="el-icon-search" @click="addBills"
                >添加</el-button
            >
        </div>

        <el-divider></el-divider>
        <!-- 数据 -->
        <div class="content_out">
            <el-table :data="tableData" border stripe>
                <el-table-column
                    type="index"
                    label="序号"
                    width="50"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题"
                    width="300"
                    show-overflow-tooltip
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="realname"
                    label="姓名"
                    width="150"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="金额"
                    width="150"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="payway"
                    label="支付方式"
                    width="150"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="remark"
                    label="备注"
                    show-overflow-tooltip
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="类型"
                    width="100"
                    :resizable="false"
                ></el-table-column>
                <el-table-column
                    prop="time"
                    label="时间"
                    width="200"
                    :resizable="false"
                >
                </el-table-column>
                <el-table-column label="操作" width="200" :resizable="false">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row.id)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <BillDialog ref="mydialog" />
        </div>

        <!-- 分页 -->
        <div class="pagination">
            <Pagination
                :total="total"
                :pageSize="10"
                @pageChange="getPage"
                ref="mypagination"
            ></Pagination>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import Pagination from '@/components/Pagination.vue'
import BillDialog from '@/components/BillDialog.vue'
import { Message, MessageBox } from 'element-ui'
export default {
    name: 'Bill_Out',
    components: {
        Pagination,
        BillDialog,
    },
    data() {
        return {
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            )
                            picker.$emit('pick', [start, end])
                        },
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            )
                            picker.$emit('pick', [start, end])
                        },
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            )
                            picker.$emit('pick', [start, end])
                        },
                    },
                ],
            },
            search: {
                time: '',
                realname: '',
                title: '',
                payway: '',
                remark: '',
                name: '支出',
                page: 1,
            },
            payways: [
                {
                    value: '支付宝',
                    label: '支付宝',
                },
                {
                    value: '微信',
                    label: '微信',
                },
                {
                    value: '银联',
                    label: '银联',
                },
                {
                    value: '现金',
                    label: '现金',
                },
                {
                    value: '其他',
                    label: '其他',
                },
            ],
            tableData: [],
            total: 0,
        }
    },
    methods: {
        handleEdit(data) {
            this.$refs.mydialog.dialogVisible = true
            this.$refs.mydialog.tit = '编辑账单'
            this.$refs.mydialog.ruleForm = data
        },
        handleDelete(id) {
            MessageBox.confirm('此操作将永久删除该账单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(async () => {
                    const parmas = { id: id }
                    const { data: res } = await this.$api.userAPI.delBill(
                        parmas
                    )
                    if (res.status === 200) {
                        Message({
                            type: 'success',
                            message: '删除成功!',
                        })
                        this.getBill()
                    } else {
                        Message({
                            type: 'error',
                            message: '删除失败!',
                        })
                    }
                })
                .catch(() => {
                    Message({
                        type: 'info',
                        message: '已取消删除',
                    })
                })
        },
        async getPage(page) {
            if (
                this.search.realname ||
                this.search.title ||
                this.search.payway ||
                this.search.remark
            ) {
                this.search.page = page
                const { data: res } = await this.$api.userAPI.searchBill(
                    this.search
                )
                if (res.status === 200) {
                    res.data.forEach((item) => {
                        item.time = dayjs(item.time).format(
                            'YYYY-MM-DD HH:mm:ss'
                        )
                    })
                    this.tableData = res.data
                    this.total = res.total
                } else {
                    Message({
                        type: 'error',
                        message: '获取失败!',
                    })
                }
            } else {
                const parmas = { page, name: this.search.name }
                this.getBill(parmas)
            }
        },
        async getBill(parmas) {
            const { data: res } = await this.$api.userAPI.getBill(parmas)
            if (res.status === 200) {
                res.data.forEach((item) => {
                    item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                })
                this.tableData = res.data
                this.total = res.total
            } else if (res.status === 404) {
                Message({
                    type: 'error',
                    message: res.message,
                })
            } else {
                Message({
                    type: 'error',
                    message: '获取失败!',
                })
            }
        },
        async onSearch() {
            if (
                this.search.realname ||
                this.search.title ||
                this.search.payway ||
                this.search.remark ||
                this.search.time
            ) {
                this.search.page = 1
                const { data: res } = await this.$api.userAPI.searchBill(
                    this.search
                )
                if (res.status === 200) {
                    this.tableData = res.data
                    this.total = res.total
                    this.$refs.mypagination.currentPage = 1
                } else if (res.status === 404) {
                    this.tableData = res.data
                    this.total = 0
                    this.$refs.mypagination.currentPage = 1
                    Message({
                        type: 'error',
                        message: res.message,
                    })
                } else {
                    Message({
                        type: 'error',
                        message: res.message,
                    })
                }
            } else {
                this.getBill({ name: '支出' })
            }
        },
        addBills() {
            localStorage.setItem('name', '支出')
            this.$router.push({ name: 'add_bill' })
        },
    },
    created() {
        this.getBill({ name: '支出' })
    },
}
</script>

<style lang="less" scpoed>
.header-out {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 20px;
    .el-button {
        margin-right: 30px;
    }
    .el-input {
        width: 200px;
        margin-right: 20px;
    }
}
.content_out {
    padding: 20px 40px;
    .el-table {
        max-width: 1640px;
        margin: 0 auto;
        .cell {
            text-align: center;
        }
    }
}
.pagination {
    text-align: center;
}

.bill_out {
    h1 {
        margin: 0 40px;
        text-align: center;
        height: 60px;
        line-height: 60px;
        background-color: #fff;
    }
    .el-divider {
        margin: 0;
    }
    .el-range-separator {
      width: 7%;
    }
}
</style>
