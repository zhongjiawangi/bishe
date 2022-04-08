const e = require('express')
const db = require('../db/index.js')

//获取家庭信息
exports.getFamilyInfo = (req, res) => {
    const houseid = req.query.id || req.user.houseid
    const selectStr =
        'select user.id,username,realname,address,rolename,houseid,ownerid from user,house,role where houseid = house.id and user.roleid=role.roleid and houseid = ? order by rolename'
    db.query(selectStr, houseid, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.length === 0) return res.cc('暂无数据')
        res.send({
            status: 200,
            message: '查询成功',
            data: result,
        })
    })
}

//修改家庭地址
exports.changeAddress = (req, res) => {
    const updateStr = 'update house set address = ? where id = ?'
    db.query(updateStr, [req.body.address, req.body.houseid], (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows !== 1) return res.cc('修改失败', 400)
        res.cc('修改成功', 200)
    })
}

//转让家主
exports.changeMaster = (req, res) => {
    // 查询id是否合法
    const selectStr = 'SELECT count(*) as total FROM user where id=? or id=?'
    db.query(
        selectStr,
        [req.query.oldMasterId, req.query.newMasterId],
        (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result[0].total !== 2) return res.cc('信息有误，修改失败', 400)
            //更新家主表家主信息
            const updateStr = 'update house set ownerid=? where id=?'
            db.query(
                updateStr,
                [req.query.newMasterId, req.query.houseid],
                (err, result) => {
                    if (err) return res.cc(err.message, 500)
                    if (result.affectedRows !== 1)
                        return res.cc('转让失败', 400)

                    // 将新家主的权限升级为家主
                    const updateStr =
                        'update user set roleid=(select roleid from role where rolename ="家主") where id=?'
                    db.query(
                        updateStr,
                        req.query.newMasterId,
                        (err, result) => {
                            if (err) return res.cc(err.message, 500)
                            if (result.affectedRows !== 1)
                                return res.cc('用户权限修改失败', 400)

                            // 将老家主的权限修改为用户
                            const updateStr =
                                'update user set roleid=(select roleid from role where rolename ="用户") where id=?'
                            db.query(
                                updateStr,
                                req.query.oldMasterId,
                                (err, result) => {
                                    if (err) return res.cc(err.message, 500)
                                    if (result.affectedRows !== 1)
                                        return res.cc('用户权限修改失败', 400)
                                    res.send({
                                        status: 200,
                                        message: '家主转让成功',
                                    })
                                }
                            )
                        }
                    )
                }
            )
        }
    )
}

//删除家庭成员
exports.deleteMember = (req, res) => {
    const updateStr = 'update user set houseid=null where id=?'
    db.query(updateStr, req.query.id, (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows === 0) return res.cc('删除失败', 400)
        res.cc('删除成功', 200)
    })
}

//创建家庭
exports.addHouse = (req, res) => {
    if (req.user.rolename !== '家主') return res.cc('你没有权限访问', 403)
    const insertStr = 'insert into house set address=? ,ownerid=?'
    db.query(insertStr, [req.body.address, req.user.id], (err, result) => {
        if (err) return res.cc(err.message, 500)
        if (result.affectedRows === 0) return res.cc('创建失败', 400)
        const updateStr =
            'update user set houseid=(select id from house where ownerid=?) where id=?'
        db.query(updateStr, [req.user.id, req.user.id], (err, result) => {
            if (err) return res.cc(err.message, 500)
            if (result.affectedRows === 0) return res.cc('绑定失败', 400)
            res.cc('创建并绑定成功', 200)
        })
    })
}
