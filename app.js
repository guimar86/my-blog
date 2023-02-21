//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const { v4: uuidv4 } = require('uuid');
app.use(express.static(__dirname));
const server_port= process.env.PORT || 3000;
let ejs = require('ejs');
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({ extended: true }));


let posts=[];
app.listen(server_port,function(){
    console.log("server running on port "+server_port);
})

app.get("/",(req,res)=>{

    res.render("index",{posts:posts});
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

app.post("/compose",(req,res)=>{

    var post={
        id:uuidv4(),
        title:req.body.blogPostTitle,
        message:req.body.blogPostMessage
    };
console.log(JSON.stringify(post)+" was sent ");
    posts.push(post);
    res.redirect("/");

});

app.get("/post/:blogId",(req,res)=>{

    var blog_id=req.params.blogId;
    var found_post=posts.find(post=>post.id===blog_id);
    res.render("blog",{post:found_post});
});