/* Importing the modules that we need to use in our application. */
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

/* Creating an instance of the express module. */
const app = express();

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

/* A middleware that parses the body of the request. */
app.use(bodyParser.urlencoded({ extended: true }));
/* Telling the server to use the public folder as a static folder. */
app.use(express.static("public"));
/* This is a middleware that is being used to create a session for the user. */
app.use(
  session({
    secret: "Our little Secret.",
    resave: false,
    saveUninitialized: false,
  })
);
/* This is a middleware that is being used to create a session for the user. */
app.use(passport.initialize());
app.use(passport.session());
/* Connecting to the database. */
mongoose.connect("mongodb://localhost:27017/userDB");

/* Creating a new schema for the users collection. */
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

/* A method that is being used to hash and salt the password. */
userSchema.plugin(passportLocalMongoose);

/* Creating a new model called User. */
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets", function (req, res) {
  if (req.isAuthenticated) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

/* This is a route that is being created. When the user clicks logout route, the server will
logout the user and redirect the user to the root route. */
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

/* Creating a new user and saving it to the database. */
app.post("/register", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

/* This is a route that is being created. When the user visits the /login route, the server will render
the login.ejs file. */
app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

/* Telling the server to listen on port 3000. */
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
