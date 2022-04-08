//导入数据库操作模块
const db = require('../db/index.js')

//导入生成token模块
const jwt = require('jsonwebtoken')
const config = require('../config.js')

//注册接口处理函数
exports.userRegister = (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const realname = req.body.realname
    const rolename = req.body.rolename
    const selectSrt = 'select * from user where username=?'
    db.query(selectSrt, username, (err, result)=>{
      if(err) return res.cc(err.message,500)
      if(result.length !== 0) return res.cc('用户名已存在', 400)
      const insertStr = 'insert into user set username=?,password=?,realname=?,roleid=(select roleid from role where rolename = ? )'
      db.query(insertStr,[username,password,realname,rolename],(err, result)=> {
        if (err) return res.cc(err.message, 500)
        if(result.affectedRows !== 1) return res.cc('注册失败',500)
        res.cc('注册成功', 201)
      })
    })
}

//登录接口处理函数
exports.userLogin = (req, res) => {
    const username = req.body.username
    const selectStr =
        'select * from user,role where user.roleid= role.roleid and username = ?'
    db.query(selectStr, username, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length != 1) return res.cc('用户名不存在')
        if (req.body.password !== result[0].password) return res.cc('密码错误',400)
        const userinfo = { ...result[0], password: null }
        const tokenStr = jwt.sign(userinfo, config.jwtSecretKey, {
            expiresIn: config.expiresIn,
        })
        res.send({
            status: 200,
            message: '登陆成功',
            token: 'Bearer ' + tokenStr,
        })
    })
}

//查找用户
exports.searchUser = (req, res) => {
    const username = req.query.username || ''
    const selectStr = 'select realname from user where username=?'
    db.query(selectStr, username, (err, results) => {
        if (err) return res.cc(err.message, 500)
        if (results.length !== 1) return res.cc('用户不存在')
        const selectStr =
            `select realname,houseid from user,role where user.roleid = role.roleid and rolename = "家主" and username='${username}'`
        db.query(selectStr, (err, results) => {
            if (err) return res.cc(err.message, 500)
            if (results.length !== 1) return res.cc('该用户名不是家主',400)
            res.send({
                status: 200,
                message: '查找成功',
                data: results[0],
            })
        })
    })
}
