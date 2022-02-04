const { fs} = require("fs");//该模块为增删改查模块
const { parse } = require("path");
var dpPath = './dp.json'

// function fn(callback){

//     setTimeout(() => {
//         callback(data)
//     }, 1000);

// }
// function callback(data){//如果要获取一个函数中异步操作的结果，则是通过回调函数来获取
//     console.log(data)
// }

exports.find = function(callback){//获取模块
    fs.readfile(dpPath,'utf-8',function(err,data){
        if(err){
            return callback(err)
        }
        callback(null,JSON.parse(data).students)
    })
}

exports.findById = function(callback){//根据id获取学生对象
    fs.readfile(dpPath,'utf-8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students//将字符串转成对象
        var ret = students.find(function(item){//（es6方法）寻找通过判断的第一个值
            return item.id === parseInt(id)
        })

        callback(null,ret)
    })
}

exports.save = function(student,callback){//添加保存学生
    fs.readfile(dpPath,'utf-8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students

        student.id = students[student.length-1].id+1//处理唯一的id，保证不重复

        students.push(student)//把传过来的学生数据放到students数据库的数组中

        var  fileData = JSON.stringify({
            students:students
        })//把对象转化为字符串

        fs.writeFile(dpPath,fileData,function(err){//把字符串保存到文件中
            if(err){
                return callback(err)//错误就把错误对象传递给回调函数
            }
            callback(null)//否则就返回null
        })
    })
}

exports.updateById = function(student,callback){//更新编辑学生
    fs.readfile(dpPath,'utf-8',function(err,data){
        if(err){
            return callback(err)
        }
        var students = JSON.parse(data).students

        student.id = parseInt(student.id)//将id从字符串转换为数字类型，防止更改后报错

        var stu = students.find(function(item){//find会遍历，当符合条件的值时会停止并返回值
            return item.id === student.id //判断id是否一致
        })
        console.log(stu)
        for(var key in student){
            stu[key] = student[key]//对应的值相等
        }

        var  fileData = JSON.stringify({
            students:students
        })//把对象转化为字符串

        fs.writeFile(dpPath,fileData,function(err){//把字符串保存到文件中
            if(err){
                return callback(err)//错误就把错误对象传递给回调函数
            }
            callback(null)//否则就返回null
        })
    })
}
exports.deleteById = function(id,callback){
    
}