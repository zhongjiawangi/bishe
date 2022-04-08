const express = require('express')

const router = express.Router()

const administratorsHandler = require('../router_handler/administratorsHandler.js')

// 获取用户
router.get('/getuser',administratorsHandler.getUsers)

//编辑用户
router.post('/edituser', administratorsHandler.editUser)

// 删除用户
router.post('/deluser',administratorsHandler.deleteUser)

// 获取家庭
router.get('/getfamilies', administratorsHandler.getFamilies)

//删除家庭
router.post('/delhouse',administratorsHandler.deleteHouse)

// 编辑家庭
router.post('/edithouse', administratorsHandler.editHouse)

//获取账单
router.post('/getbills',administratorsHandler.getBills)

//获取排行榜
router.get('/getleaderboard', administratorsHandler.getLeaderboard)

module.exports = router