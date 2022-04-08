import register from "@/untils/register.js"

//获取用户列表
const getUsers = (params={}) => {
  return register({
    method: 'GET',
    url:'/admin/getuser',
    params
  })
}

//编辑用户
const editUser = (data) => {
  return register({
    method: 'POST',
    url:'/admin/edituser',
    data
  })
}

// 删除用户
const deleteUser = (data) => {
  return register({
    method: 'POST',
    url:'/admin/deluser',
    data
  })
}

//获取家庭列表
const getFamilies = (params={}) => {
  return register({
    method: 'GET',
    url:'/admin/getfamilies',
    params
  })
}

//删除家庭
const deleteHouse = (data={}) => {
  return register({
    method: 'POST',
    url:'/admin/delhouse',
    data
  })
}

// 编辑家庭
const editHouse = (data={}) => {
  return register({
    method: 'POST',
    url:'/admin/edithouse',
    data
  })
}

//获取最近一个月的收支账单
const getBills = (data) => {
  return register({
    method: 'POST',
    url:'/admin/getbills',
    data
  })
}

//获取排行榜
const getLeaderboard = (params={}) => {
  return register({
    method: 'GET',
    url:'/admin/getleaderboard',
    params
  })
}

export default {
  getUsers,
  editUser,
  deleteUser,
  getFamilies,
  getBills,
  getLeaderboard,
  deleteHouse,
  editHouse
}