const db = require('../db/index.js')

//导入生成token模块
const jwt = require('jsonwebtoken')
const config = require('../config.js')

//获取用户信息
exports.getInfo = (req, res) => {
    const id = req.user.id
    const selectStr =
        'select * from user,role where user.roleid= role.roleid and user.id = ?'
    db.query(selectStr, id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length !== 1) return res.cc('查询失败', 400)
        const userinfo = { ...result[0], password: null }
        res.send({
            status: 200,
            message: '退出成功',
            data: userinfo,
        })
    })
}

//修改用户信息
exports.updateInfo = (req, res) => {
    const id = req.user.id
    // 修改用户名
    if (req.body.username) {
        const selectStr = 'select * from user where username = ?'
        db.query(selectStr, req.body.username, (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.length > 0) res.cc('用户名已存在', 400)
            const updateStr = 'update user set username = ? where id=?'
            db.query(
                updateStr,
                [req.body.username, req.user.id],
                (err, result) => {
                    if (err) return res.cc(err.message, 500)
                    if (result.affectedRows !== 1)
                        return res.cc('修改失败', 400)
                    res.cc('修改成功', 200)
                }
            )
        })
    }

    //修改密码
    if (req.body.password) {
        const selectStr = 'select * from user where id =?'
        db.query(selectStr, id, (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.length === 0) return res.cc('用户不存在')
            if (result[0].password != req.body.oldpassword)
                return res.cc('原密码错误', 400)
            const updateStr = 'update user set password = ? where id=?'
            db.query(updateStr, [req.body.password, id], (err, result) => {
                if (err) return res.cc(err.message, 500)
                if (result.affectedRows !== 1) return res.cc('修改失败', 400)
                res.cc('修改成功', 200)
            })
        })
    }
    // 修改姓名
    if (req.body.realname) {
        const updateStr = 'update user set realname = ? where id=?'
        db.query(updateStr, [req.body.realname, id], (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.affectedRows !== 1) return res.cc('修改失败', 400)
            res.cc('修改成功', 200)
        })
    }
}

// 获取账单列表
exports.getBill = (req, res) => {
    var totleStr =
        'select count(*) as total from bill,user, type, payway where user.id=bill.userid and bill.typeid=type.id and bill.paywayid=payway.id ' +
        req.str
    //查询总条数
    db.query(totleStr, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length === 0) return res.cc('获取失败，暂无数据')
        req.total = result[0].total

        // 获取页码
        const page = req.query.page ? (parseInt(req.query.page) - 1) * 10 : 0
        const selectStr =
            'select bill.id,title,realname,money,payway,remark,time,paywayid,typeid,name from bill,user, type, payway where user.id=bill.userid and bill.typeid=type.id and bill.paywayid=payway.id ' +
            req.str +
            ` order by bill.id desc limit ${page},10`
        db.query(selectStr, (err, result) => {
            if (err) return res.cc(err.message)
            if (result.length === 0) return res.cc('获取失败，暂无数据')
            res.send({
                status: 200,
                message: '获取成功',
                data: result,
                total: req.total,
            })
        })
    })
}

// 搜索账单
exports.searchBill = (req, res) => {
    const totleStr =
        'SELECT count(*) as total FROM bill,user,payway,type where bill.userid=user.id and bill.paywayid=payway.id and bill.typeid=type.id ' +
        req.str
    db.query(totleStr, (err, result) => {
        if (err) return res.cc(err.message)
        if (result.length === 0) return res.cc('暂无数据')
        req.total = result[0].total
        // 获取页码
        const page = req.query.page ? (parseInt(req.query.page) - 1) * 10 : 0
        const selectStr =
            'select bill.id,title,realname,money,payway,remark,time,paywayid,typeid,name from bill,user, type, payway where user.id=bill.userid and bill.typeid=type.id and bill.paywayid=payway.id ' +
            req.str +
            ` order by bill.id desc limit ${page},10`
        db.query(selectStr, (err, result) => {
            if (err) return res.cc(err.message)
            if (result.length === 0) return res.cc('获取失败，暂无数据')
            res.send({
                status: 200,
                message: '获取成功',
                data: result,
                total: req.total,
            })
        })
    })
}

// 添加账单
exports.addBill = (req, res) => {
    const title = req.body.title || ''
    const userid = req.user.id || ''
    const money = req.body.money || ''
    const remark = req.bodyNaNpxark || ''
    const time = req.body.time || ''
    const typeid = req.body.typeid || ''
    const paywayid = req.body.paywayid || ''
    const insertStr = 'insert into bill set ?'
    db.query(
        insertStr,
        { title, userid, money, remark, time, typeid, paywayid },
        (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.affectedRows !== 1) return res.cc('添加失败', 400)
            res.send({
                status: 201,
                message: '添加成功',
            })
        }
    )
}

// 删除账单
exports.delBill = (req, res) => {
    var id = req.query.id
    const delStr = 'delete from bill where id =?'
    db.query(delStr, id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows !== 1) return res.cc('删除失败', 400)
        res.cc('删除成功', 200)
    })
}

//更新账单
exports.updateBill = (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const money = req.body.money
    const remark = req.bodyNaNpxark
    const payway = req.body.payway
    const updateStr =
        'update bill set title=?,money=?,remark=?,paywayid=(select id from payway where payway.payway=? ) where id =?'
    db.query(updateStr, [title, money, remark, payway, id], (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows !== 1) return res.cc('修改失败', 400)
        res.cc('修改成功', 200)
    })
}

//绑定家庭
exports.bindHouse = (req, res) => {
    const username = req.body.username || req.user.username
    const houseid = req.body.houseid || null
    const selectStr = 'select * from house where id =?'
    db.query(selectStr, houseid, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length !== 1) return res.cc('家庭不存在', 400)
        const selectStr = 'select * from user where username =?'
        db.query(selectStr, username, (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.length !== 1) return res.cc('用户不存在', 400)
            const updateStr = 'update user set houseid=? where username =?'
            db.query(updateStr, [houseid, username], (err, result) => {
                if (err) return res.cc(err.message, 500)
                if (result.affectedRows !== 1) return res.cc('绑定失败', 400)
                res.cc('绑定成功', 200)
            })
        })
    })
}

//退出家庭
exports.exitHouse = (req, res) => {
    const id = req.user.id
    const updateStr = 'update user set houseid=null where id=?'
    db.query(updateStr, id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows !== 1) return res.cc('退出失败', 400)
        res.send({
            status: 200,
            message: '退出成功',
        })
        /* const selectStr =
            'select * from user,role where user.roleid= role.roleid and user.id = ?'
        db.query(selectStr, id, (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.length !== 1) return res.cc('查询失败', 400)
            const userinfo = { ...result[0], password: null }
            const tokenStr = jwt.sign(userinfo, config.jwtSecretKey, {
                expiresIn: config.expiresIn,
            })
            res.send({
                status: 200,
                message: '退出成功',
                token: 'Bearer ' + tokenStr,
            })
        }) */
    })
}
