const joi = require('joi')

const id = joi.number().min(1).required()

const title = joi.string().required()

const money = joi.number().min(0).required()

const payway = joi.string().required()

const name = joi.string().required()

const username = joi.string()

//添加账单的数据校验
exports.add_bill_schema = {
    body: {
        title,
        money,
        payway,
        name,
    },
}

// 更新账单的数据校验
exports.update_bill_schema = {
    body: {
        id,
        title,
        money,
        payway,
        name,
    },
}

//绑定家庭数据校验
exports.bind_house_schema = {
    body: {
        houseid: id,
        username
    },
}
