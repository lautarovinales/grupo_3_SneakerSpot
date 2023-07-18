const express = require('express');
const fs = require('fs');
const path = require('path');


const app = express();
const puerto = 3000;

app.use(express.json());
app.use('/', express.static(__dirname + '/public'));

app.get("/",(req,res)=>{
    let ruta = path.join(__dirname, "./views/index.html")
    res.sendFile(ruta);
})

app.get("/login",(req,res)=>{
    let ruta = path.join(__dirname, "./views/login.html")
    res.sendFile(ruta);
})

app.get("/productCart",(req,res)=>{
    let ruta = path.join(__dirname, "./views/productCart.html")
    res.sendFile(ruta);
})

app.get("/productDetail",(req,res)=>{
    let ruta = path.join(__dirname, "./views/productDetail.html")
    res.sendFile(ruta);
})

app.get("/register",(req,res)=>{
    let ruta = path.join(__dirname, "./views/register.html")
    res.sendFile(ruta);
})

app.listen(puerto, () => {
    console.log('Aplicación escuchando en puerto 3000');
});