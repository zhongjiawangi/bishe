<template>
    <div class="finance-form">
        <h1>财务报表</h1>
        <div class="search">
            <div class="block">
                <el-date-picker
                    v-model="search.time"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
            </div>
            <el-input placeholder="姓名" v-model="search.realname" clearable>
            </el-input>
            <el-input placeholder="标题" v-model="search.title" clearable>
            </el-input>
            <el-select
                v-model="search.name"
                clearable
                placeholder="请选择账单类型"
            >
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="searchBill"
                >搜索</el-button
            >
            <el-button icon="el-icon-delete" @click="reset">重置</el-button>
        </div>
        <el-divider></el-divider>
        <!-- echarts图表 -->
        <div class="echarts-box">
            <div class="echart" id="pie"></div>
            <div class="echart" id="bar"></div>
            <div class="echart" id="pay-pie"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FinanceForm',
    data() {
        return {
            search: {
                realname: '',
                title: '',
                type: '',
                time: [],
            },
            options: [
                {
                    value: '支出',
                    label: '支出',
                },
                {
                    value: '收入',
                    label: '收入',
                },
            ],
            // 时间快捷选择
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
                        text: '最近一年',
                        onClick(picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 365
                            )
                            picker.$emit('pick', [start, end])
                        },
                    },
                ],
            },
        }
    },
    methods: {
        reset() {
            this.search = {
                realname: '',
                title: '',
                name: '',
                time: [],
            }
        },
        searchBill() {
            this.$api.adminAPI.getBills(this.search).then((result) => {
                if (result.data.status === 200) {
                    this.setEcharts(result.data.data)
                }
            })
        },
        setEcharts(obj) {
            // 支付方式饼图配置项
            var payPieOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{c}({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: '10',
                    top: '10',
                },
                series: [
                    {
                        name: '账单',
                        type: 'pie',
                        radius: '65%',
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 20,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                            label: {
                                show: true,
                                fontSize: '28',
                                fontWeight: 'bold',
                            },
                        },
                        data: [
                            { value: obj.wechat.wechat || 0, name: '微信' },
                            { value: obj.unionPay.unionPay || 0, name: '银联' },
                            { value: obj.alipay.alipay || 0, name: '支付宝' },
                            { value: obj.cash.cash || 0, name: '现金' },
                            { value: obj.other.other || 0, name: '其他' },
                        ],
                    },
                ],
            }
            //支出收入饼图配置项
            var pieOption = {
                title: {
                    text: '收支对比',
                    bottom: '10',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                },
                legend: {
                    left: '40',
                    top: '40',
                },
                series: [
                    {
                        name: '账单',
                        type: 'pie',
                        radius: ['40%', '80%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 20,
                            borderColor: '#fff',
                            borderWidth: 10,
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '28',
                                fontWeight: 'bold',
                                formatter: '{b} ({d}%)',
                            },
                        },
                        data: [
                            {
                                value: obj.all.expenditure || 0,
                                name: '支出',
                                groupId: 1,
                                itemStyle: {
                                    color: 'rgb(255, 112, 112)',
                                },
                            },
                            {
                                value: obj.all.revenue || 0,
                                name: '收入',
                                groupId: 0,
                                itemStyle: {
                                    color: 'rgb(54, 151, 215)',
                                },
                            },
                        ],
                    },
                ],
            }
            // 支付方式柱形图配置
            var barOption = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                legend: {
                    top: '2%',
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'value',
                    },
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            show: false,
                        },
                        data: ['其他', '银联', '现金', '微信', '支付宝'],
                    },
                ],
                series: [
                    {
                        name: '收入',
                        type: 'bar',
                        stack: 'Total',
                        label: {
                            show: true,
                        },
                        emphasis: {
                            focus: 'series',
                        },
                        itemStyle: {
                            color: 'rgb(54, 151, 215)',
                        },
                        data: [
                            obj.other.otherIn || 0,
                            obj.unionPay.unionPayIn || 0,
                            obj.cash.cashIn || 0,
                            obj.wechat.wechatIn || 0,
                            obj.alipay.alipayIn || 0,
                        ],
                    },
                    {
                        name: '支出',
                        type: 'bar',
                        stack: 'Total',
                        label: {
                            show: true,
                            position: 'left',
                        },
                        emphasis: {
                            focus: 'series',
                        },
                        itemStyle: {
                            color: 'rgb(255, 112, 112)',
                        },
                        data: [
                            -obj.other.otherOut || -0,
                            -obj.unionPay.unionPayOut || -0,
                            -obj.cash.cashOut || -0,
                            -obj.wechat.wechatOut || -0,
                            -obj.alipay.alipayOut || -0,
                        ],
                    },
                ],
            }

            const myPayPie = this.echarts.init(
                document.getElementById('pay-pie')
            )
            const myBar = this.echarts.init(document.getElementById('bar'))
            const myPie = this.echarts.init(document.getElementById('pie'))
            myBar.setOption(barOption)
            myPie.setOption(pieOption)
            myPayPie.setOption(payPieOption)
        },
    },
    mounted() {
        this.$api.adminAPI.getBills(this.search).then((result) => {
            if (result.data.status === 200) {
                this.setEcharts(result.data.data)
            }else {
              this.setEcharts(result.data.data)
            }
        })
    },
}
</script>

<style lang="less" scoped>
.finance-form {
    text-align: center;
    h1 {
        margin: 0 40px;
        height: 60px;
        line-height: 60px;
        background-color: #fff;
    }
    .search {
        padding: 20px;
        display: flex;
        justify-content: flex-end;
        .el-input {
            width: 200px;
            margin-right: 20px;
        }
        .el-select {
            margin-right: 20px;
        }
        .el-button {
            margin-right: 30px;
        }
        .block {
            margin-right: 20px;
            /deep/.el-range-input {
                cursor: pointer;
            }
        }
    }
    .el-divider {
        margin: 0;
    }
    .echarts-box {
        display: flex;
        padding: 40px 20px;
        .echart {
            flex: 2;
            height: 600px;
            margin: 20px;
            background-color: #fff;
        }
        .echart:nth-child(2) {
            flex: 3;
        }
    }
}
</style>
