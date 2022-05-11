var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')
var top = require('./models/topic')
var router = express.Router()
var fs = require('fs')
var Blogs = require('./models/comment')
const { query } = require('express')

router.get('/', function(req, res) {
  Blogs.find(function(err,Blogs){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('index.html',{
      Blogs:Blogs,
      user: req.session.user
    })
  })
})

router.get('/login', function (req, res) {
  res.render('login.html')
})

router.post('/login', function (req, res) {
  // 1. 获取表单数据
  // 2. 查询数据库用户名密码是否正确
  // 3. 发送响应数据
  var body = req.body

  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    
    // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }

    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/register', function (req, res) {
  res.render('register.html')
})

router.post('/register', function (req, res) {
  // 1. 获取表单提交的数据
  //    req.body
  // 2. 操作数据库
  //    判断改用户是否存在
  //    如果已存在，不允许注册
  //    如果不存在，注册新建用户
  // 3. 发送响应
  var body = req.body
  User.findOne({
    $or: [{
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '服务端错误'
      })
    }
    // console.log(data)
    if (data) {
      // 邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
      return res.send(`邮箱或者密码已存在，请重试`)
    }

    // 对密码进行 md5 重复加密
    body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error.'
        })
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user

      // Express 提供了一个响应方法：json
      // 该方法接收一个对象作为参数，它会自动帮你把对象转为字符串再发送给浏览器
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })

      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
})

router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')
})

router.get('/admin', function (req, res) {
  const email = req.session.user.email
  Blogs.findOne({email:email},function(err,ret){
    res.render('settings/admin.html',{
    user: req.session.user,
    Blogs:ret
  })
  })
  
})
router.post('/admin', function (req, res) {

  res.render('settings/admin.html',{
    user: req.session.user
  })
})
router.get('/profile', function (req, res) {
  res.render('settings/profile.html',{
    user: req.session.user
  })
})


router.get('/blog1', function (req, res) {
  top.find({articleId:"621b5640c66d2928c473815d"},function(err,tops){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('blog1.html',{
      tops:tops
    })
  })
})
router.post('/blog1', function (req, res) {
  const body = req.body
  body["articleId"]= "621b5640c66d2928c473815d"
  body["email"] = req.session.user.email
  body["nickname"] = req.session.user.nickname
  new top(body).save(function(err){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.redirect('/blog1')
  })
})

router.get('/blog2', function (req, res) {
  res.render('blog2.html')
})

router.get('/topics/new', function (req, res) {
  res.render('new.html',{
    user: req.session.user
  })
  // res.status(200).json({
  //   err_code: 0,
  //   message: 'OK'
  // })
})
router.post('/topics/new', function (req, res) {
    const body = req.body
    body["email"] = req.session.user.email
    body["nickname"] = req.session.user.nickname
    new Blogs(body).save(function(err,ret){
              if(err){
                  console.log('保存失败')
              }else{
                  console.log('保存成功')

              }})
    res.redirect('/')
})

router.get('/blog', function (req, res) {
  const id = (req.query.id).replace(/\"/g,"")
  top.find({articleId:id},function(err,tops){
    if(err){
      return res.status(500).send('Sever error')
    }
    Blogs.findOne({_id:id},function(err,blog){
      if(err){
        return res.status(500).send('Sever error')
      }
      res.render('blog.html',{
      tops:tops,
      Blogs:blog
    })
    })
  })
})

router.post('/blog', function (req, res) {
  const body = req.body
  body["articleId"]=body.articleId.replace(/\"/g,"")
  body["email"] = req.session.user.email
  body["nickname"] = req.session.user.nickname
  console.log(body)
  new top(body).save(function(err){
    if(err){
      return res.status(500).send('Sever error')
    }
  })
  res.redirect('/')
})

router.get('/blog3', async (req, res)=> {
  const id = (req.query.id).replace(/\"/g,"")
  try {
      const topic = await top.findOne({_id:id})
      const comments = await Blogs.find({articleId:id})
      res.render('blog3.html',{
        Blogs:Blogs,
        tops:tops,
        user:req.session.user
      })
  }catch (e) {
      throw e
  }
})

router.get('/show', async (req, res)=> {
  const soid = (req.session.user._id).replace(/\"/g,"")
  try {
      // const topic = await top.findOne({_id:soid})
      const comments = await Blogs.find({articleId:id})
      console.log(comments)
      res.render('blog3.html',{
        Blogs:comments,
        // tops:tops,
        user:req.session.user
      })
  }catch (e) {
      throw e
  }
})

router.get('/article/search', function (req, res) {
  res.render('search.html',{
    user: req.session.user
  })
})
router.post('/article/search', function (req, res) {
  Blogs.find({keyword:req.body.keyword},function(err,ret){
    if(err){
      return res.status(500).send('Sever error')
    }else{
      res.render('search.html',{
        Blogs:ret,
        keyword:req.body.keyword
    })
    }
    
  })
})

router.get('/myblog', function (req, res) {
  const user =  req.session.user
  const email = user.email
  Blogs.find({email:email},function(err,blogs){
    res.render('settings/myblog.html',{
    user: user,
    Blogs:blogs
  })
  })
  
})
router.get('/myblog/delete', function (req, res) {
  const id = (req.query.id).replace(/\"/g,"")
  Blogs.remove({_id:id},function(err,blogs){
    if(err){
      return res.status(500).send('Sever error')
    }
  res.redirect('/myblog')
  })
  
})
router.get('/myblog/amend', function (req, res) {
  const id = (req.query.id).replace(/\"/g,"")
  Blogs.findOne({_id:id},function(err,blogs){
    if(err){
      return res.status(500).send('Sever error')
    }
  res.render('amend.html',{
    Blogs:blogs
  })
  })
  
})

router.get('/backstage',function(req,res){
  Blogs.find(function(err,ret){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('settings/backstage.html',{
      Blogs:ret,
      user:req.session.user
  })
  })
  
})

router.get('/backstage/delete', function (req, res) {
  const id = (req.query.id).replace(/\"/g,"")
  Blogs.remove({_id:id},function(err,blogs){
    if(err){
      return res.status(500).send('Sever error')
    }
  res.redirect('/backstage')
  })
})

router.get('/backsort',function(req,res){
  Blogs.find(function(err,ret){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('settings/backsort.html',{
      Blogs:ret,
      user:req.session.user
  })
  })
})

router.post('/backsort/sort',function(req,res){
  const model = req.body.model
  const id= (req.body.id).replace(/\"/g,"")
  Blogs.findByIdAndUpdate(id,{model:model},function(err,ret){
    if(err){
                  console.log('保存失败')
              }else{
                  console.log('保存成功')
                  console.log(ret)
                  
              }
  })
  res.redirect('/backsort')
})

router.post('/admin/updata',function(req,res){

  const id = (req.body.id).replace(/\"/g,"")
  const password = req.body.password
  Blogs.findByIdAndUpdate(id,{password:password},function(err,ret){
    if(err){
                  console.log('保存失败')
              }else{
                  console.log('保存成功')
                  console.log(ret)
                  
              }
  })
  res.redirect('/')
})

router.get('/sort',function(req,res){
  Blogs.find(function(err,ret){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('sort.html',{
      Blogs:ret,
      user:req.session.user
  })
  })
})
router.get('/sort/part',function(req,res){
  const model =  req.query.model
  Blogs.find({model:model},function(err,ret){
    if(err){
      return res.status(500).send('Sever error')
    }
    res.render('sort.html',{
      Blogs:ret,
      user:req.session.user
  })
  })
})
// router.get('/backstage/all', function (req, res) {
//   id = req.query.id
//   Blogs.find(function(err,ret){
//     if(err){
//       return res.status(500).send('Sever error')
//     }else{
//       res.render('backstage.html',{
//         Blogs:ret,
//     })
//     }
//   })
// })
// router.post('/backstage/all', function (req, res) {
//   id = req.body.id
//   Blogs.remove({_id:id},function(err,ret){
//     if(err){
//       return res.status(500).send('Sever error')
//     }
//   })
// })

// router.get('/backstage/hot', function (req, res) {
//   id = req.query.id
//   try {
//     const ret = Blogs.find({articleId:id})
//     res.render('topic/show.html',{
//       Blogs:ret
//     })
// }catch (e) {
//     throw e
// }
// })
// router.post('/backstage/hot', function (req, res) {
//   id = req.body.id
//   Blogs.remove({_id:id},function(err,ret){
//     if(err){
//       return res.status(500).send('Sever error')
//     }
//   })
// })


module.exports = router
