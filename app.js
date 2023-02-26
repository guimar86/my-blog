//jshint esversion:6
const express=require("express");
const app=express();

//Body Parser
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const { v4: uuidv4 } = require('uuid');

//ejs
let ejs = require('ejs');
app.set("view engine","ejs")

app.use(express.static(__dirname));
const server_port= process.env.PORT || 3000;

/*MongoDB */
const MongoClient = require("mongodb").MongoClient;
const uri='mongodb://root:example@mongo:27017/?maxPoolSize=20&w=majority';
const assert=require("assert");
const client = new MongoClient(uri);

let posts=[];

client.connect(function(err){

    assert.equal(null,err);
    //console.log("Connected successfully to server");
    const db=client.db("blogs-db");
    client.close();
}).then(()=> console.log("Connected to mongodb server"))
.catch(error => console.error(error.stack));

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
    posts.push(post);
    res.redirect("/");

});

app.get("/post/:blogId",(req,res)=>{

    var blog_id=req.params.blogId;
    var found_post=posts.find(post=>post.id===blog_id);
    res.render("blog",{post:found_post});
});