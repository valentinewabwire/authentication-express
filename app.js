/* Importing the modules that we need to use in our application. */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

/* Creating an instance of the express module. */
const app = express();

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

/* A middleware that parses the body of the request. */
app.use(bodyParser.urlencoded({ extended: true }));
/* Telling the server to use the public folder as a static folder. */
app.use(express.static("public"));

/* Connecting to the database. */
mongoose.connect("mongodb://localhost:27017/userDB");

/* Creating a new schema for the users collection. */
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

/* Creating a new model called User. */
const User = new mongoose.model("User", userSchema);

/* Telling the server to render the home.ejs file when the user visits the root route. */
app.get("/", function (req, res) {
  res.render("home");
});

/* Telling the server to render the login.ejs file when the user visits the /login route. */
app.get("/login", function (req, res) {
  res.render("login");
});

/* Telling the server to render the register.ejs file when the user visits the /register route. */
app.get("/register", function (req, res) {
  res.render("register");
});

/* Creating a new user and saving it to the database. */
app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

/* Telling the server to listen on port 3000. */
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
