<template>
    <el-menu
        :collapse="isCollapse"
        :router="true"
        :default-active="getPath"
        :unique-opened="true"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
        <div class="title">{{ isCollapse ? '财务' : '家庭财务管理系统' }}</div>
        <!-- 主页 -->
        <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
                <span>主页</span>
        </el-menu-item>
        
        <!-- 支出管理 -->
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-shopping-cart-2"></i>
                <span>支出管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/bill_out">
                <i class="el-icon-sold-out"></i>
                支出详情
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <!-- 收入管理 -->
        <el-submenu index="3">
            <template slot="title">
                <i class="el-icon-money"></i>
                <span>收入管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/bill_in">
                <i class="el-icon-sell"></i>
                收入详情
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <!-- 统计报表 -->
        <el-submenu index="4">
            <template slot="title">
                <i class="el-icon-s-data"></i>
                <span>统计报表</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/form">
                <i class="el-icon-s-data"></i>
                统计报表
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

         <!-- 家庭成员管理 -->
        <el-submenu index="5" v-if="$store.state.userinfo.rolename !== '系统管理员'">
            <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>家庭管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/family">
                <i class="el-icon-user-solid"></i>
                <span>家庭成员信息</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>

        <!-- 系统管理 -->
        <el-submenu index="6" v-if="$store.state.userinfo.rolename === '系统管理员'">
            <template slot="title">
                <i class="el-icon-setting"></i>
                <span>系统管理</span>
            </template>
            <el-menu-item-group>
                <el-menu-item index="/user">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
                </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
                <el-menu-item index="/families">
                <i class="el-icon-s-custom"></i>
                <span>家庭管理</span>
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Menu',
    computed: {
        ...mapGetters(['isCollapse']),
        getPath() {
            return this.$route.path
        }
    }
}
</script>

<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
}
.title {
    line-height: 60px;
    text-align: center;
    font-size: 20px;
    color: #fff;
}
.el-menu-vertical-demo {
  border: 0;
}

</style>
