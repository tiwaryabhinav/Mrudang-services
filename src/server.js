const express=require('express')
const { ObjectID } = require('mongodb')
const path=require('path')
require('./db/mongoose')
const app=express()
app.use(express.json())
const port=process.env.PORT
const login_router=require('./db/routers/login_router')
app.use(login_router)
app.set('view eingine', 'ejs');


//app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname + '/public'));


app.get('/',(req,res)=>{
    res.render('index.ejs',{
        alert:''
    })
})



app.listen(port,()=>{
    console.log("port is established on ",port);
})

