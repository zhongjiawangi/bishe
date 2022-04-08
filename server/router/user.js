const express = require('express')

const router = express.Router()

const userHandler = require('../router_handler/user.js')

// 导入验证规则
const expressJoi = require('@escook/express-joi')
const { user_login_schema, user_reg_schema } = require('../schema/user.js')

// 注册
router.post('/register',expressJoi(user_reg_schema),userHandler.userRegister)
// 登录
router.post('/login',expressJoi(user_login_schema),userHandler.userLogin)

router.get('/search',userHandler.searchUser)


module.exports = router