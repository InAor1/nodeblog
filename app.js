var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var router = require('./router')
const template = require('art-template');
const multer =require('multer')
const fs = require('fs')
var app = express()


app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

//上传图片配置
const upload = multer({ dest: './public/upload' })
app.post('/upload', upload.single('img'), (req, res)=>{
  console.log(req.file)

  fs.renameSync(req.file.path,'public\\upload\\'+  req.file.originalname)
});
app.post('/profile/img', upload.single('img'), (req, res)=>{
  console.log(req.file)

  fs.renameSync(req.file.path,'public\\upload\\'+  req.file.originalname)
});

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

// 配置解析表单 POST 请求体插件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//使用第三方中间件：express-session
app.use(session({
  // 配置加密字符串，它会在原有加t密基础之上和这个字符串拼起来去加密
  // 目的是为了增加安全性，防止客户端恶意伪造
  secret: 'tast',
  resave: false,
  saveUninitialized: false // 无论你是否使用 Session ，都默认直接给你分配一把钥匙
}))

// 把路由挂载到 app 中
app.use(router)

app.listen(5000, function () {//确认端口
  console.log('running...')
})
