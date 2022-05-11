const e = require('express')
var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var topSchema = new Schema({
    articleId: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        default: Date.now
    }
})

 module.exports = mongoose.model('top', topSchema)
// var top = mongoose.model('top', topSchema)
//  admin = new top({
//      comments: 'sdafas',
//   articleId: '"621c4ffeefb4d54ffced66a1"',
//   email: '1928078480@qq.com',
//   nickname: '123456'
//     })
//     admin.save(function(err,ret){
//         if(err){
//             console.log('保存失败')
//         }else{
//             console.log('保存成功')
//             console.log(ret)
//         }
//     })


// top.remove({content:'测试4'},function(err){
//     if(err){
//                     console.log('删除失败')
//                 }else{
//                     console.log('删除gc')
//                 }

// })
