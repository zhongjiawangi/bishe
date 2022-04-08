const express = require('express')

const app = express()

//配置跨域
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//解析token的中间件
const config = require('./config.js')
const expressJWT = require('express-jwt')
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

//错误函数中间件
app.use((req, res, next) => {
  res.cc= (message, status = 404, data=[]) => {
    res.send({
      status,
      message,
      data
    })
  }
  next()
})

//导入用户路由
const userRouter = require('./router/user.js')
app.use('/api',userRouter)

//用户信息路由
const userinfoRouter = require('./router/userinfo.js')
app.use('/my',userinfoRouter)


//家庭信息路由
const familyRouter = require('./router/family.js')
app.use('/family', familyRouter)

const administratorsRouter = require('./router/administrators.js')
app.use('/admin', administratorsRouter)

const Joi = require('joi')
const { UnauthorizedError } = require('express-jwt/lib')
// 4.1 错误级别中间件
app.use(function (err, req, res, next) {
  // 4.1 Joi 参数校验失败
  if (err instanceof Joi.ValidationError) {
    return res.send({
      status: 400,
      message: err.message
    })
  }

  // token认证失败
  if (err.name === 'UnauthorizedError') {
    res.send({
      status: 401,
      message: '身份认证失败'
    })
  }
  // 4.2 未知错误
  res.send({
    status: 500,
    message: err.message
  })
})

app.listen(3007,()=>{
  console.log('server running at http://127.0.0.1:3007');
})