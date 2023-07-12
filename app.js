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

app.listen(puerto, () => {
    console.log('Aplicación esuchando en puerto 3000');
});


