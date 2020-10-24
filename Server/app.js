const express=require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({
    extended:true
  }))
var cos= require("cors");
app.use(cos());
//托管静态资源给路由
app.use('/uploads',express.static(__dirname+"/uploads"))
//业务路由
app.use('/users',require('./userRouter'))

app.listen(4399,()=>{
    console.log("http://localhost:4399")
})


