const express = require('express')
const db = require('../db/index.js')

const router = express.Router()

// 处理函数
const userinfoHandler = require('../router_handler/userinfo.js')

//数据校验
const expressJoi = require('@escook/express-joi')
const {
    add_bill_schema,
    update_bill_schema,
    bind_house_schema,
} = require('../schema/userinfo.js')

//获取用户信息
router.get('/userinfo', userinfoHandler.getInfo)

//修改用户信息
router.post('/update_info', userinfoHandler.updateInfo)

const billFormat = (req, res, next) => {
    var selectStr = ''
    if (req.user.rolename === '用户') {
        selectStr = selectStr + ` and userid=${req.user.id}`
    }
    if (req.user.rolename === '家主') {
        if (req.user.houseid) {
            selectStr = selectStr + ` and user.houseid=${req.user.houseid}`
        } else {
            selectStr = selectStr + ` and user.id=${req.user.id}`
        }
    }
    if (req.query.name) {
        selectStr = selectStr + ` and type.name='${req.query.name}'`
    }
    if (req.query.title) {
        selectStr = selectStr + ` and title like '%${req.query.title}%'`
    }
    if (req.query.realname) {
        selectStr = selectStr + ` and realname like '%${req.query.realname}%'`
    }
    if (req.query.payway) {
        selectStr = selectStr + ` and payway='${req.query.payway}'`
    }
    if (req.query.remark) {
        selectStr =
            selectStr +
            ` (remark like '%${req.query.remark}%' or isnull(remark))`
    }
    // 选择了时间
    if (req.query.time) {
        selectStr =
            selectStr +
            ` and time between '${req.query.time[0]}' and '${req.query.time[1]}'`
    }
    req.str = selectStr
    next()
}
// 获取账单
router.get('/userinfo/bill', billFormat, userinfoHandler.getBill)

// 搜索账单
router.get('/userinfo/search_bill', billFormat, userinfoHandler.searchBill)

// 添加支出账单
const dataFilter = (req, res, next) => {
    const payway = req.body.payway
    req.body.money = req.body.money.toFixed(2)
    req.body.time = new Date()
    const selectStr = 'select id from payway where payway=? '
    db.query(selectStr, payway, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length === 0) return res.cc('添加失败', 400)
        req.body.paywayid = result[0].id
        const selectStr = 'select id from type where name=?'
        const name = req.body.name
        db.query(selectStr, name, (err, result) => {
            if (err) return res.cc(err.message)
            if (result.length === 0) return res.cc('添加失败', 400)
            req.body.typeid = result[0].id
            next()
        })
    })
}
router.post(
    '/userinfo/add_bill',
    expressJoi(add_bill_schema),
    dataFilter,
    userinfoHandler.addBill
)

// 删除账单
router.get('/userinfo/del_bil', userinfoHandler.delBill)

//更新账单
router.post(
    '/userinfo/update_bil',
    expressJoi(update_bill_schema),
    userinfoHandler.updateBill
)

//绑定家庭
router.post(
    '/userinfo/bind_house',
    expressJoi(bind_house_schema),
    userinfoHandler.bindHouse
)

//退出家庭
router.get('/userinfo/exit_house', userinfoHandler.exitHouse)

module.exports = router
