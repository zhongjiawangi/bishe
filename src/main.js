import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import apis from '@/api'

import '@/assets/css/base.css'

// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts'

import { Button, Container, Header, Aside, Main, Menu, MenuItem, MenuItemGroup,Submenu,Input,Select, Option, Table, TableColumn,Divider, Pagination,Breadcrumb ,BreadcrumbItem,Form,FormItem,Dialog,Dropdown,DropdownMenu,DropdownItem,Card,PageHeader, DatePicker } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Divider)
Vue.use(Pagination)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Card)
Vue.use(PageHeader)
Vue.use(DatePicker)


Vue.prototype.echarts = echarts
Vue.config.productionTip = false

Vue.prototype.$api = apis

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
