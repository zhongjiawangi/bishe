const express = require('express')

const router = express.Router()

const familyHandler = require('../router_handler/familyHandler.js')

const expressJoi = require('@escook/express-joi')
const {change_address_schema, change_master_schema} = require('../schema/family.js')

// 获取家庭信息
router.get('/info',familyHandler.getFamilyInfo)

// 修改家庭地址
router.post('/change_address',expressJoi(change_address_schema),familyHandler.changeAddress)

// 转让家主
router.get('/change_master', expressJoi(change_master_schema), familyHandler.changeMaster)

// 删除家庭成员
router.get('/delmember', familyHandler.deleteMember)

//创建家庭
router.post('/addhouse', familyHandler.addHouse)

module.exports = router