<template>
    <div class="home-container">
        <!-- 第一层 -->
        <div class="one">
            <el-card class="box-card info">
                <h1>欢迎你</h1>
                <h2>{{ $store.state.userinfo.rolename }}</h2>
            </el-card>
            <el-card class="box-card bangdan">
                <h6>月度排行榜</h6>
                <div class="item-box">
                    <el-card class="box-card bangban-item" shadow="hover">
                        <span>本月消费</span>
                        <ul>
                            <li
                                v-for="(item, index) in shouRuBang"
                                :key="index"
                            >
                                <span>{{ index + 1 }}. </span> {{ item }}
                            </li>
                        </ul>
                    </el-card>
                    <el-card class="box-card bangban-item" shadow="hover">
                        <span>本月收入</span>
                        <ul>
                            <li
                                v-for="(item, index) in zhiChuBang"
                                :key="index"
                            >
                                <span>{{ index + 1 }}. </span> {{ item }}
                            </li>
                        </ul>
                    </el-card>
                </div>
            </el-card>
        </div>
        <!-- 第二层 -->
        <div class="two">
            <el-card class="box-card bar" id="bar"> </el-card>
            <el-card class="box-card pie" id="pie"> </el-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            shouRuBang: [],
            zhiChuBang: []
        }
    },
    methods: {
        setEcharts(obj) {
            const myPie = this.echarts.init(document.getElementById('pie'))
            const myBar = this.echarts.init(document.getElementById('bar'))
            //饼状图配置项
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
                            },
                            {
                                value: obj.all.revenue || 0,
                                name: '收入',
                                groupId: 0,
                            },
                        ],
                    },
                ],
            }
            //柱形图配置项
            var barOption = {
                title: {
                    text: '支付方式',
                    left: 'center',
                    bottom: '10',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999',
                        },
                    },
                },
                legend: {
                    left: 'center',
                    top: '10',
                },
                xAxis: {
                    type: 'category',
                    data: ['其他', '银联', '现金', '微信', '支付宝'],
                },
                yAxis: {
                    type: 'value',
                    name: '￥',
                },
                series: [
                    {
                        name: '支出',
                        data: [
                            obj.other.otherOut || 0,
                            obj.unionPay.unionPayOut || 0,
                            obj.cash.cashOut || 0,
                            obj.wechat.wechatOut || 0,
                            obj.alipay.alipayOut || 0,
                        ],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)',
                        },
                    },
                    {
                        name: '收入',
                        data: [
                            obj.other.otherIn || 0,
                            obj.unionPay.unionPayIn || 0,
                            obj.cash.cashIn || 0,
                            obj.wechat.wechatIn || 0,
                            obj.alipay.alipayIn || 0,
                        ],
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)',
                        },
                    },
                ],
            }
            //挂载配置项
            myBar.setOption(barOption)
            myPie.setOption(pieOption)
        }
    },
    created() {
        this.$api.adminAPI.getLeaderboard().then((result) => {
            if (result.data.status === 200) {
                const { data: res } = result
                this.shouRuBang = res.data.shouRuBang
                this.zhiChuBang = res.data.zhiChuBang
            }
        })
    },
    mounted() {
        this.$api.adminAPI.getBills().then((result) => {
                this.setEcharts(result.data.data)
        })
    }
}
</script>

<style lang="less" scoped>
.home-container {
    padding: 10px 40px;
    .one {
        height: 320px;
        margin-bottom: 38px;
        display: flex;
        text-align: center;
        .bangdan {
            flex: 2;
            margin-left: 40px;
            .item-box {
                height: 250px;
                display: flex;
                .bangban-item {
                    flex: 1;
                    margin: 20px;
                    color: #999;
                    font-size: 18px;
                    font-weight: 700;
                    ul {
                        margin-top: 20px;
                        li {
                            margin: 10px 0;
                            color: #666;
                            font-weight: 400;
                        }
                    }
                }
            }
            h6 {
                font-size: 20px;
            }
        }
        .info {
            flex: 1;
            text-align: center;
            h1 {
                margin-top: 50px;
                margin-bottom: 20px;
                font-size: 40px;
            }
            h2 {
                font-size: 26px;
                margin-bottom: 10px;
            }
        }
    }
    .two {
        display: flex;
        height: 500px;
        .bar,
        .pie {
            flex: 1;
        }
        .pie {
            margin-left: 10px;
        }
    }
}
</style>
