import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

Vue.use(VueRouter)

const routes = [
  { path: '', component: () => import('@/views/Layout/Layout.vue'), children: [
    { meta: '主页', path: '', name: 'home', component: () => import('@/views/Layout/user/Home.vue')},
    { meta: '收入', path: '/bill_out', name: 'bill_out', component: () => import('@/views/Layout/user/Bill_Out.vue')},
    { meta: '支出', path: '/bill_in', name: 'bill_in', component: () => import('@/views/Layout/user/Bill_In.vue')},
    { meta: '添加', path: '/add_bill', name: 'add_bill', component: () => import('@/views/Layout/Bill/AddBill.vue')},
    { meta: '报表', path: '/form', name: 'form', component: () => import('@/views/Layout/user/FinanceForm.vue')},
    { meta: '家庭', path: '/family', name: 'family', component: () => import('@/views/Layout/master/FamilyManage.vue')},
    { meta: '家庭管理', path: '/families', name: 'families', component: () => import('@/views/Layout/administrators/FamilyManage.vue')},
    { meta: '用户', path: '/user', name: 'user', component: () => import('@/views/Layout/administrators/UserManage.vue')}
  ]},
  { path: '/login', name: 'login', component: () => import('@/views/Login/Login.vue')},
  { path: '/register', name: 'register', component: () => import('@/views/Login/register.vue')}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,form,next) => {
  const token = localStorage.getItem('token')
  if ((to.name !== 'login' && to.name !== 'register') && !token){
    Message({
      showClose: true,
      message: '你还未登录，请登录！',
      type: 'error'
    })
    setTimeout(() => {
      next({name: 'login'})
    },2000)
  }
  next()
})

export default router
