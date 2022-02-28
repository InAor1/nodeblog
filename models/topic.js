const e = require('express')
var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var topSchema = new Schema({
    // title:{
    //     type:String,
    //     required:true
    // },
    content:{
        type:String,
        required:true
    },
    time: {
        type: Date,
        default: Date.now
    },
    keyword: {
        type:String,
        default:1
    },
})

module.exports = mongoose.model('top', topSchema)

// admin = new top({
//     title:'admin',
//     content:'123456',
//     })
//     admin.save(function(err,ret){
//         if(err){
//             console.log('保存失败')
//         }else{
//             console.log('保存成功')
//             console.log(ret)
//         }
//     })

// var top = mongoose.model('top', topSchema)
// top.remove({content:'测试4'},function(err){
//     if(err){
//                     console.log('删除失败')
//                 }else{
//                     console.log('删除gc')
//                 }

// })
