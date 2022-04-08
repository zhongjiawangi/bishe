import register from '@/untils/register.js'

// 获取家庭信息
const getFamilyInfo = (params = {}) => {
    return register({
        method: 'GET',
        url: '/family/info',
        params,
    })
}

// 修改地址
const changeAddress = (data) => {
    return register({
        method: 'POST',
        url: '/family/change_address',
        data,
    })
}

// 转让家主
const changeMaster = (params = {}) => {
    return register({
        method: 'GET',
        url: '/family/change_master',
        params,
    })
}

// 删除成员
const deleteMember = (params = {}) => {
  return register({
      method: 'GET',
      url: '/family/delmember',
      params,
  })
}

//创建家庭
const addHouse = (data) => {
  return register({
      method: 'POST',
      url: '/family/addhouse',
      data,
  })
}


export default {
    getFamilyInfo,
    changeAddress,
    changeMaster,
    deleteMember,
    addHouse
}
