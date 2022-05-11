var mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var blogSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    created_time: {
        type: Date,
        //这里不能写Date.now()，因为会即刻调用,
        // 这里给了一个方法Date.now
        // 当new model的时候，如果没有传递created_time属性，mongoose就会调用该方法
        default: Date.now
    },
    model:{
        type: Number,
        enum: [0, 1, 2, 3]
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