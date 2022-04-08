<template>
    <div class="main-container">
        <!-- 左侧菜单 -->
        <div class="aside"><AsideMenu></AsideMenu></div>
        <!-- 主体 -->
        <!-- <div :class="$store.state.isCollapse ? 'content' : 'content maxwidth'"> -->
        <div class="content">

            <!-- 头部 -->
            <div class="header"><Header></Header></div>
            <!-- 内容 -->
            <div class="main">
              <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import AsideMenu from '@/views/Layout/AsideMenu.vue'
import Header from '@/views/Layout/Header.vue'
import Content from '@/views/Layout/Content.vue'

export default {
    name: 'Main',
    components: {
        AsideMenu,
        Header,
        Content,
    },
    //获取用户信息
    async created() {
        const { data: res } = await this.$api.userAPI.getUserInfo()
        if (res.status === 200) {
            const { id, realname, houseid, photo, rolename, username } =
                res.data
            const userinfo = {
                id,
                realname,
                houseid,
                photo,
                rolename,
                username,
            }
            localStorage.setItem('rolename', rolename)
            this.$store.commit('pushUserInfo', userinfo)
        } else {
            if (localStorage.getItem('token')) {
                localStorage.removeItem('token')
            }
            setTimeout(() => {
                this.$router.push({ name: 'login' })
            }, 1000)
        }
    },
}
</script>

<style lang="less" scoped>
.main-container {
    display: flex;
    .aside {
        height: 100vh;
        background-color: #545c64;
    }
    .content {
        flex: 1;
        // transition: all 1s;
        background-color: #f5f5f5;
        .header {
            height: 70px;
            width: 100%;
        }
    }
    .maxwidth {
        max-width: 1720px;
    }
}
</style>
