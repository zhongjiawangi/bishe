const db = require('../db/index.js')

// 获取用户
exports.getUsers = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const selectStr =
        'select user.id,username,password,realname,address,rolename from user left join house on user.houseid=house.id,role where user.roleid = role.roleid and user.roleid != 1'
    db.query(selectStr, (err, results) => {
        if (err) return res.cc(err.message, 500)
        if (results.length === 0) return res.cc('暂无数据')
        res.cc('查询成功', 200, results)
    })
}

//编辑用户
exports.editUser = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const selectStr = 'select count(*) as total from user where username =?'
    db.query(selectStr, req.body.username, (err, results) => {
      if (err) return res.cc(err.message, 500)
      if (results[0].total !== 0 )
        return res.cc('用户名已存在,请重新输入', 403) 
      const updateStr = 'update user set ? where id=?'
      db.query(updateStr, [req.body,req.body.id], (err, result)=>{
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows === 0) return res.cc('修改失败',400)
        res.cc('修改成功', 200)
      })
    })
}

//删除用户
exports.deleteUser = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const id = req.body.id
    const deleteStr = 'delete from user where id =?'
    db.query(deleteStr, id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows !== 1) return res.cc('删除失败', 400)
        res.cc('删除成功', 200)
    })
}

// 获取家庭
exports.getFamilies = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const selectStr =
        'select house.id,ownerid,realname,username,address from house,user where house.ownerid = user.id'
    db.query(selectStr, (err, results) => {
        if (err) return res.cc(err.message, 500)
        if (results.length === 0) return res.cc('暂无数据')
        res.cc('查询成功', 200, results)
    })
}

//编辑家庭
exports.editHouse = (req, res) => {
    console.log(req.body)
}

//删除家庭
exports.deleteHouse = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const id = req.body.id
    const updateStr = 'update user set houseid=null where houseid = ?'
    db.query(updateStr, id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows === 0) return res.cc('更新失败', 400)
        const deleteStr = 'delete from house where id = ?'
        db.query(deleteStr, id, (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.affected === 0) return res.cc('删除失败', 400)
            res.cc('删除成功', 200)
        })
    })
}

//获取账单
exports.getBills = (req, res) => {
    var selectStr =
        'select bill.id,money,payway,name,realname,title from bill,type,payway,user where typeid = type.id and paywayid = payway.id and userid = user.id'
    if (req.user.rolename !== '系统管理员') {
        selectStr = selectStr + ` and user.id = ${req.user.id}`
    }
    // 选择了标题
    if (req.body.title) {
        selectStr = selectStr + ` and title like '%${req.body.title}%'`
    }
    // 选择了名字
    if (req.body.realname) {
        selectStr = selectStr + ` and realname like '%${req.body.realname}%'`
    }
    // 选择了类型
    if (req.body.name) {
        selectStr = selectStr + ` and name = '${req.body.name}'`
    }
    // 选择了时间
    if (Object.keys(req.body).length > 0 && req.body.time.length > 0) {
        selectStr =
            selectStr +
            ` and time between '${req.body.time[0]}' and '${req.body.time[1]}'`
    } else {
        selectStr = selectStr + ' and TO_DAYS(NOW()) - TO_DAYS(time) <= 30'
    }
    selectStr = selectStr + ' order by money desc'
    db.query(selectStr, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length < 1)
            return res.cc('暂无数据', 404, {
                all: {},
                alipay: {},
                wechat: {},
                cash: {},
                unionPay: {},
                other: {},
            })
        // 支出
        const expenditure = result
            .filter((item) => item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        // 收入
        const revenue = result
            .filter((item) => item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)
        // 支付宝
        const alipay = result
            .filter((item) => item.payway === '支付宝')
            .reduce((sum, item) => (sum += item.money), 0)
        // 微信
        const wechat = result
            .filter((item) => item.payway === '微信')
            .reduce((sum, item) => (sum += item.money), 0)
        // 现金
        const cash = result
            .filter((item) => item.payway === '现金')
            .reduce((sum, item) => (sum += item.money), 0)
        // 银联
        const unionPay = result
            .filter((item) => item.payway === '银联')
            .reduce((sum, item) => (sum += item.money), 0)
        // 其他
        const other = result
            .filter((item) => item.payway === '其他')
            .reduce((sum, item) => (sum += item.money), 0)

        // 支付宝 支出/收入
        const alipayOut = result
            .filter((item) => item.payway === '支付宝' && item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        const alipayIn = result
            .filter((item) => item.payway === '支付宝' && item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)

        // 微信
        const wechatOut = result
            .filter((item) => item.payway === '微信' && item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        const wechatIn = result
            .filter((item) => item.payway === '微信' && item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)

        // 现金
        const cashOut = result
            .filter((item) => item.payway === '现金' && item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        const cashIn = result
            .filter((item) => item.payway === '现金' && item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)

        // 银联
        const unionPayOut = result
            .filter((item) => item.payway === '银联' && item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        const unionPayIn = result
            .filter((item) => item.payway === '银联' && item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)

        // 其他
        const otherOut = result
            .filter((item) => item.payway === '其他' && item.name === '支出')
            .reduce((sum, item) => (sum += item.money), 0)
        const otherIn = result
            .filter((item) => item.payway === '其他' && item.name === '收入')
            .reduce((sum, item) => (sum += item.money), 0)

        res.cc('查询成功', 200, {
            all: { expenditure, revenue },
            alipay: { alipay, alipayOut, alipayIn },
            wechat: { wechat, wechatOut, wechatIn },
            cash: { cash, cashOut, cashIn },
            unionPay: { unionPay, unionPayOut, unionPayIn },
            other: { other, otherOut, otherIn },
        })
    })
}

//获取排行榜
exports.getLeaderboard = (req, res) => {
    if (req.user.rolename !== '系统管理员')
        return res.send({ status: 403, message: '你没有权限访问' })
    const selectStr =
        'select name,realname,money from user,bill,type where userid=user.id and typeid=type.id  and TO_DAYS(NOW()) - TO_DAYS(time) <= 30'
    db.query(selectStr, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length < 0) return res.cc('暂无数据')
        var objOut = {}
        var objIn = {}
        result
            .filter((item) => item.name === '支出')
            .forEach((item) => {
                if (objOut[item.realname]) {
                    objOut[item.realname] += item.money
                } else {
                    objOut[item.realname] = item.money
                }
            })
        result
            .filter((item) => item.name === '收入')
            .forEach((item) => {
                if (objIn[item.realname]) {
                    objIn[item.realname] += item.money
                } else {
                    objIn[item.realname] = item.money
                }
            })
        const arrOut = Object.entries(objOut).sort((a, b) => {
            return b[1] - a[1]
        })
        const arrIn = Object.entries(objIn).sort((a, b) => b[1] - a[1])
        var zhiChuBang = ['虚位以待', '虚位以待', '虚位以待']
        var shouRuBang = ['虚位以待', '虚位以待', '虚位以待']
        if (arrOut.length <= 3) {
            for (let i = 0; i < arrOut.length; i++) {
                zhiChuBang[i] = arrOut[i][0] + ' ￥' + arrOut[i][1]
            }
        } else {
            for (let i = 0; i < 3; i++) {
                zhiChuBang[i] = arrOut[i][0] + ' ￥' + arrOut[i][1]
            }
        }
        if (arrIn.length <= 3) {
            for (let i = 0; i < arrIn.length; i++) {
                shouRuBang[i] = arrIn[i][0] + ' ￥' + arrIn[i][1]
            }
        } else {
            for (let i = 0; i < 3; i++) {
                shouRuBang[i] = arrIn[i][0] + ' ￥' + arrIn[i][1]
            }
        }
        res.cc('查询成功', 200, {
            zhiChuBang,
            shouRuBang,
        })
    })
}
