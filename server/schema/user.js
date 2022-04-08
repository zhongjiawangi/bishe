const joi = require('joi')

const username = joi.string().min(2).max(12).required()

const password = joi.string().alphanum().pattern(/^[\S]{3,15}$/).required()

const realname = joi.string().required()

const rolename = joi.string().required()

const address = joi.string()

const houseid = joi.number()



exports.user_login_schema = {
  body: {
    username,
    password
  }
}
exports.user_reg_schema = {
  body: {
    username,
    password,
    realname,
    rolename,
    address,
    houseid
  }
}

// exports.add_bill_schema = {
//   body: {
//     title,
//     money,
//     payway,
//     name
//   }
// }