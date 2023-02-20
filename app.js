const express=require("express");
const bodyParser=require("body-parser");
const app=express();
app.use(express.static(__dirname));
const server_port= process.env.PORT || 3000;
let ejs = require('ejs');
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(server_port,function(){
    console.log("server running on port "+server_port);
})

app.get("/",(req,res)=>{

    res.render("index");
});

app.get("/about",(req,res)=>{

    res.render("about");
});

app.get("/contact",(req,res)=>{

    res.render("contact");
});

app.get("/compose",(req,res)=>{

    res.render("compose");
});