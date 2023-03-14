//jshint esversion:6
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const { Schema } = mongoose;
const bodyParser=require("body-parser");
const { v4: uuidv4 } = require('uuid');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//ejs
let ejs = require('ejs');
app.set("view engine","ejs")
app.use(express.static(__dirname));
const server_port= process.env.PORT || 3000;


let posts=[];

/* Mongodb*/
const url='mongodb://root:example@mongo:27017/blogs-db';

//schema
const blogSchema=new Schema({
title:String,
message:String,
id:String
});

//model
const Blog=mongoose.model("Blog",blogSchema);

app.listen(server_port,function(){
    console.log("server running on port "+server_port);
});

app.get("/", async(req,res)=>{
    
    res.render("index",{posts:posts});
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/contact",(req,res)=>res.render("contact"));


app.get("/blogger",(req,res)=>{

    res.render("blogger");
});

app.post("/blogger", (req,res)=>{

   
   let blog=new Blog({
    id:uuidv4(),
    title:req.body.blogPostTitle,
    message:req.body.blogPostMessage
   });
    
    saveToMongo(blog).then(()=>res.redirect("/")).catch(()=>res.redirect("/contact"));
   

});

app.get("/post/:blogId",(req,res)=>{

    let blog_id=req.params.blogId;
    let found_post=posts.find(post=>post.id===blog_id);
    res.render("blog",{post:found_post});
});

async function saveToMongo(post) {
    console.log("About to save");
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family:4
      }).then(()=>{
          console.log("Connected to Mongo with Mongoose");
      }).catch((err) => { 
          console.log("Error connecting to mongodb with mongoose " + err);
          console.error(err);
      });
    
    
    post.save();
}