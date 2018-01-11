const http = require('http')
const fs = require('fs')
const querystring = require('querystring');
const url = require('url')

http.createServer((req,res)=>{

    // console.log(url.parse(req.url))

    let reqUrl = url.parse(req.url).pathname

    let obj = {
        code:3,
        msg:'用户不存在,可以注册'
    }
    let sql = [] // 存放txt文件下的用户列表
    let thisUser = [] // 当前登录或注册的用户信息
    
    if(reqUrl === '/login'){

        let d = ''
        req.on('data',function(dd){
            d += dd
        });
        req.on('end',function(){
            thisUser = querystring.parse(d) // 把URL字符串str解析成一个键值对的集合
            console.log(thisUser)
        });

        fs.readFile('www/dbs.txt',(error,data)=>{
            if(error){
                console.log('打开dbs.txt文件失败')
            }else{
                sql = JSON.parse(data) // 读取已存在用户列表
                for(let i=0; i<sql.length; i++){
                    if(sql[i].username === thisUser.username) {
                        if(sql[i].password === thisUser.password){
                            obj.code = 0
                            obj.msg = '登录成功'
                            res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                            res.write(JSON.stringify(obj))
                            res.end()
                            return
                        }else{
                            obj.code = 1
                            obj.msg = '密码错误'
                            res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                            res.write(JSON.stringify(obj))
                            res.end()
                            return
                        }
                    }
                }
                res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                res.write(JSON.stringify(obj))
                res.end()

            }
        })

    }else if(reqUrl === '/register'){

        let d = ''
        req.on('data',function(dd){
            d += dd
        });
        req.on('end',function(){
            thisUser = querystring.parse(d)
        });

        fs.readFile('www/dbs.txt',(error,data)=>{
            if(error){
                console.log('打开dbs.txt文件失败')
            }else{
                sql = JSON.parse(data)
                for(let i=0; i<sql.length; i++){
                    if(sql[i].username === thisUser.username) {
                        obj.code = 2
                        obj.msg = '用户名已存在'
                        res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                        res.write(JSON.stringify(obj))
                        res.end()
                        return
                    }
                }

                sql.push(thisUser)

                fs.writeFileSync("www/dbs.txt" , JSON.stringify(sql) , "utf-8") // 写入用户名和密码
                res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                res.write(JSON.stringify(obj))
                res.end()

            }
        })
    }else{

        let url = 'www' + reqUrl
        fs.readFile(url,(error,data)=>{
            if(error){
                res.writeHead(404,{"Content-Type":"text/html;charset=UTF-8"})
                res.write('<h1 style="text-align:center;margin:100px;"><a href="http://127.0.0.1:8888/login.html">请先登录</a></h1>')
            }else{
                res.writeHead(200,{"Content-Type":"text/html;charset=UTF-8"})
                res.write(data.toString())
            }
            res.end()
        })

    }
   
}).listen(8888)

console.log("服务器已启动，请登录：http://127.0.0.1:8888")
