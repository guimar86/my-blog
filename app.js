//jshint esversion:6
const express=require("express");
const app=express();
const MongoClient = require('mongodb').MongoClient;

//Body Parser
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const { v4: uuidv4 } = require('uuid');

//ejs
let ejs = require('ejs');
app.set("view engine","ejs")

app.use(express.static(__dirname));
const server_port= process.env.PORT || 3000;


let posts=[];

/* Mongodb*/
const url='mongodb://root:example@mongo:27017/?maxPoolSize=20&w=majority';
const client=new MongoClient(url,{monitorCommands:true});
client.on('commandStarted', started => console.log(started));

app.listen(server_port,function(){
    console.log("server running on port "+server_port);
});

app.get("/",(req,res)=>{
    
    readFromMongo().then(data=>{
        res.render("index",{posts:data});
    });
    //res.render("index",{posts:posts_from_db});
});

app.get("/about",(req,res)=>{
    res.render("about");
});

app.get("/contact",(req,res)=>res.render("contact"));


app.get("/blogger",(req,res)=>{

    res.render("blogger");
});

app.post("/blogger",(req,res)=>{

    var post={
        id:uuidv4(),
        title:req.body.blogPostTitle,
        message:req.body.blogPostMessage
    };
    posts.push(post);
   saveToMongoDb(post);
    res.redirect("/");

});

app.get("/post/:blogId",(req,res)=>{

    var blog_id=req.params.blogId;
    var found_post=posts.find(post=>post.id===blog_id);
    res.render("blog",{post:found_post});
});

async function saveToMongoDb(post){
    console.log("Saving to mongo");

    const database = client.db("blog-posts");
    const collection = database.collection("blogs");
    const result = await collection.insertOne(post);
    console.log(
       `A document was inserted with the _id: ${result}`,
    );
}

async function readFromMongo(){

    console.log("reading from Mongo");
    var results=[];
    const database = client.db("blog-posts");
    const collection = database.collection("blogs");
    var cursor=await collection.find({});
    var docs=await cursor.toArray();
    for await (const doc of docs) {
        results.push(doc);
      }
    return results;
}