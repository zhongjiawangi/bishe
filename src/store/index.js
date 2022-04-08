import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isCollapse: false,
        userinfo: {},
        houseid: 0,
        flag: true,
        id: null,
        family: [],
    },
    getters: {
        isCollapse(state) {
            return state.isCollapse
        },
        hasFamily(state) {
            return state.userinfo.houseid ? true : false
        },
    },
    mutations: {
        changeCollapse(state) {
            state.isCollapse = !state.isCollapse
        },
        pushUserInfo(state, userinfo) {
            state.userinfo = userinfo
        },
        changeHouseId(state, houseid) {
            state.houseid = houseid
        },
        pushFamily(state, family) {
            state.family = family
        },
    },
    actions: {
        async getUserInfo(context) {
            const { data: res } = await api.userAPI.getUserInfo()
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
                context.commit('pushUserInfo', userinfo)
            }
        },
        async getFamilyInfo(context, params) {
            const { data: res } = await api.familyAPI.getFamilyInfo(params)
            if (res.status === 200) {
                context.commit('pushFamily', res.data)
            }
        },
    },
    modules: {},
})
