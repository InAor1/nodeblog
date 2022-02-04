var fs = require('fs')
var express = require('express')
//express中专门用来包装路由的一个方法
var router = express.Router()//1创建一个路由容器
var Student = require('./student')//引入
const { render } = require('art-template')

router.get('/', (req, res) => {
    fs.readFile('./dp.json','utf-8',function(err,data){//在中间的是可选的，意味将文件转为该字符，还能通过data。toString（）来转换
      if(err){
        return res.status(500).send('sever err')
      }
      let students = JSON.parse(data).students

      res.render('index.html',{
      students:students //前面两个是将字符串转化成对象，后面是交给student
    }
    )
    })
  })
  
router.get('/students/new',function(req,res){
  res.render('new.html')
})

  
router.post('/students/new',function(req,res){
  Student.save(res.body,function(err){//将传过来的数据放入save中为stduent形参
    if(err){
      return res.status(500),send('sever error')
    }
    res.redirect('/students')
  })
})

router.get('/students',function(req,res){
  Student.find(function(err,students){//直接通过回调函数获取数据，find是一个students。js内的read file方法
    if(err){
      return res.status(500),send('sever error')
    }
    res.render('index.html'),{
      student: students//第二个studenets为回调的数据形参
    }
  })
})

router.get('/students/edit',function(req,res){//更新编辑学生
    Student.findById(parseInt(req.juery.id),function(err,student){//寻找相对应id的学生
      if(err){
        return res.status(500),send('sever error')
      }
      res.render('edit.html',{//再用修改模块的HTML页面发送给修改模块
        student:student
      })
    })
})

router.post('/students/edit',function(req,res){
  Student.findById(parseInt(req.juery.id),function(err,student){//寻找相对应id的学生
    if(err){
      return res.status(500),send('sever error')
    }
    res.redirect('/students')
  })
})

router.get('/students/delete',function(req,res){
  
})

router.post('/post',function(req,res){
  var body1 = req.body;
  console.log(body1);
  res.render('post.html')
})//post形式的输入界面

router.get('/404',function(req,res){
    res.render('404.html')
})//错误时404界面

router.get('/post',function(req,res){
    res.render('post.html')
})//输入界面

router.get('/pinglun',function(req,res){
  res.redirect('/')//重定向，返回首页
})

module.exports = router

// module.exports = function(router){
//     router.get('/', (req, res) => {
//         fs.readFile('./dp.json',utf-8,function(err,data){//在中间的是可选的，意味将文件转为该字符，还能通过data。toString（）来转换
//           if(err){
//             return res.status(500).send('sever err')
//           }
//         })
//         res.render('index.html',{
//           student:JSON.parse(data).student //前面两个是将字符串转化成对象，后面是交给student
//         }
//         )
      
//       })
      
//       router.post('/post',function(req,res){
//         var body1 = req.body;
//         console.log(body1);
//         res.render('post.html')
//       })//post形式的输入界面
      
//       router.get('/404',function(req,res){
//           res.render('404.html')
//       })//错误时404界面
      
//       router.get('/post',function(req,res){
//           res.render('post.html')
//       })//输入界面
      
//       router.get('/pinglun',function(req,res){
//         res.redirect('/')//重定向，返回首页
//       })
      
// }