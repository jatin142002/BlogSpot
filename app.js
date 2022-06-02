//jshint esversion:6

let posts = [];

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

///////////////////////////////////////
const mongoose = require("mongoose");
//////////////////////////////////////

const homeStartingContent =
  "Get start with your BLOGS !!";
const aboutContent =
  "This is a perfect place if you want to spot the web dev blogs. By web developers, for web developers, BLOGSPOT offers the latest news in the world of web development. This includes opinion articles, tips & tricks to start off on the right foot. Here , in  BLOGSPOT we build all the necessary and recent blogs and these blogs are very much relevant and to the point to the audience. Are you looking to learn how to minimize downtime? How about ensuring your site is secure and easy for consumers to navigate? From noob to master all new things you will get here.";
const contactContent =
  "STAY CONNECTED WITH US !!";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

///////////////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true});

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogSchema);

//////////////////////////////////////////////

app.get("/", function (req, res) {
///////////////////////////////////////////

  posts = [];
  Blog.find({}, function (err, docs) {
    if(err)
    {
      console.log("Error occurred");
    }
    else
    {
      console.log("Success !");
      posts = posts.concat(docs);
      res.render("home", { homeContent: homeStartingContent, posts: docs });
    }
  });
  ///////////////////////////////////////

});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postContent,
  };

  posts.push(post);
/////////////////////////////////
  const newblog = new Blog({
    title: req.body.postTitle,
    content: req.body.postContent,
  });

  newblog.save(function(err){
    if(err)
    {
      console.log("Can't Compose Error Occured");
    }
    else
    {
      console.log("Successfully composed !");
      res.redirect("/");
    }
  });
  //////////////////////////////
});

app.get("/posts/:title", function (req, res) {
  let flag = false;
  let currtitle, currcontent;
  for (let i = 0; i < posts.length; i++) {
    if (_.lowerCase(posts[i].title) === _.lowerCase(req.params.title)) {
      flag = true;
      currtitle = posts[i].title;
      currcontent = posts[i].content;
      break;
    }
  }

  if (flag) {
    console.log("Match found !!");
    res.render("post", { title: currtitle, content: currcontent });
  } else {
    console.log("Match not found !!");
    res.redirect("/");
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
