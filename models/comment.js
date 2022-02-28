var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var blogSchema = new Schema({
    title:{
        type:String,
    },
    content:{
        type:String,
        required:true
    },
    img:{
        type:String
    },
    time: {
        type: Date,
        default: Date.now
    },
    keyword: {
        type:String,
     }
})

 module.exports = mongoose.model('Blogs', blogSchema)

// var Blogs = mongoose.model('Blogs', blogSchema)

// Blogs.remove({content:'冰墩墩和雪容融的前世今生.'},function(err){
//     if(err){
//                     console.log('删除失败')
//                 }else{
//                     console.log('删除gc')
//                 }
// })

// admin = new Blogs({
//     title:'测试4',
//     content:'测试4',
//     keyword:'123'
//     })
//     admin.save(function(err,ret){
//         if(err){
//             console.log('保存失败')
//         }else{
//             console.log('保存成功')
//             console.log(ret)
//         }
//     })