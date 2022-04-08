import register from '@/untils/register.js'

// 登录
const Login = (data) => {
  return register({
    method: 'POST',
    url: '/api/login',
    data
  })
}

// 注册
const Register = (data) => {
  return register({
    method: 'POST',
    url: '/api/register',
    data
  })
}


//查询用户
const searchUser = (params) => {
  return register({
    method: 'GET',
    url: '/api/search',
    params
  })
}

// 获取用户信息
const getUserInfo = (params={}) => {
  return register({
    method: 'GET',
    url: '/my/userinfo',
    params
  })
}

//修改姓名密码
const uodateUserInfo = (data) => {
  return register({
    method: 'POST',
    url: '/my/update_info',
    data
  })
}

// 获取用户账单
const getBill = (params={}) => {
  return register({
    method: 'GET',
    url: '/my/userinfo/bill',
    params
  })
}

// 搜索账单
const searchBill = (params={}) => {
  return register({
    method: 'GET',
    url: '/my/userinfo/search_bill',
    params
  })
}

// 添加账单
const addBill = (data) => {
  return register({
    method: 'POST',
    url: '/my/userinfo/add_bill',
    data
  })
}

// 删除账单
const delBill = (params) => {
  return register({
    method: 'GET',
    url: '/my//userinfo/del_bil',
    params
  })
}

//更新账单
const updateBill = (data) => {
  return register({
    method: 'POST',
    url: '/my/userinfo/update_bil',
    data
  })
}

//绑定家庭
const bindHouse = (data) => {
  return register({
    method: 'POST',
    url: '/my/userinfo/bind_house',
    data
  })
}

//退出家庭
const exitHouse = (params={}) => {
  return register({
    method: 'GET',
    url: '/my/userinfo/exit_house',
    params
  })
}

export default {
  Login,
  Register,
  uodateUserInfo,
  searchUser,
  getUserInfo,
  getBill,
  searchBill,
  addBill,
  delBill,
  updateBill,
  bindHouse,
  exitHouse
}