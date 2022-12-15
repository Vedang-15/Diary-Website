const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");
const date = require(__dirname + "/views/date.js");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-vedanghatekar:Vedangmh15@cluster0.feij1io.mongodb.net/diaryDB", {useNewUrlParser : true});

const blogSchema = new mongoose.Schema({
  currdate : String,
  title : String,
  content: String,
  name: String
});

const Blog = mongoose.model("Blog", blogSchema);


let posts = [];

app.get("/", function(req, res){
  Blog.find({}, function(err, posts){
    res.render("home", {homeContent : homeStartingContent, postArray : posts});
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutInfo : aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactInfo : contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/entries/:topic", function(req, res){
  let inpString = lodash.lowerCase(req.params.topic);
  Blog.find({}, function(err, posts){
    if(!err){
      for(let i = 0; i<posts.length; i++){
        let pTitle = lodash.lowerCase(posts[i].title);
        if(pTitle === inpString){
          res.render("post", {obj : posts[i]});
          break;
        }
      }
    }
  });
});

app.post("/compose", function(req, res){
  const day = date.getDate();
  let post = new Blog({
    currdate : day,
    title : req.body.PostTitle,
    content : req.body.PostDescrip,
    name : req.body.PostName
  })
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.post("/newPost", function(req, res){
  res.redirect("/compose");
});

let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}
app.listen(port, function(){
  console.log("Server has started successfully.");
});
