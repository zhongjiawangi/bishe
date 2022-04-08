<template>
    <div class="header-container">
        <!-- 左侧按钮 -->
        <el-button
            type="primary"
            icon="el-icon-menu"
            @click="isCollapse"
        ></el-button>
        <!-- 右侧内容 -->
        <div class="header-right">
            <div class="box">
                <span>{{$store.state.userinfo.realname}}</span>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <i class="el-icon-user"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='info'>个人信息</el-dropdown-item>
                        <el-dropdown-item command='logout'>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    <InfoDialog ref="infoDialog"/>

    </div>
</template>

<script>
import InfoDialog from '@/components/InfoDialog.vue'
export default {
    name: 'Header',
    components: {
      InfoDialog
    },

    methods: {
        isCollapse() {
            this.$store.commit('changeCollapse')
        },
        handleCommand (command) {
          if (command === 'info'){
            this.$refs.infoDialog.dialogVisible = true
          }else {
            this.logout()
          }
        },
        logout () {
          localStorage.removeItem('token')
          localStorage.removeItem('rolename')
          this.$router.push({name: 'login'})
        }
    },
}
</script>

<style lang="less" scoped>
.header-container {
    display: flex;
    align-items: center;
    background-color: rgb(21, 116, 194);
    height: 80%;
    .el-button {
        margin-left: 10px;
    }
}
.header-right {
    flex: 1;
    padding-right: 50px;
    color: #333;
    .box {
        float: right;
        display: flex;
        font-size: 20px;
        span {
            margin-right: 20px;
            // text-decoration: underline;
        }
        .el-icon-user {
          font-size: 20px;
          line-height: 30px;
          cursor: pointer;
          color: #fff;
        }
        .el-dropdown-item {
          width: 50px;
        }
        i {
          margin: 0 10px;

        }
    }
}
</style>
