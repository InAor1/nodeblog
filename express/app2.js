const express = require('express')
var bodyParser = require('body-parser')
const fs = require('fs')
var router = require('./router')

var  app = express()
const port = 3000//确认端口

app.engine('html',require('express-art-template'))//配置模板引擎

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())//配置中间件bodyParser

app.use('/node-modules/',express.static('./node-modules/'))//申请调用允许
app.use('/public/',express.static('./public/'))

app.use(router)//把路由挂载在app服务中

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})//服务器启动语