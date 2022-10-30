/* Importing the express module. */
const express = require("express");
/* A middleware that parses the body of the request. */
const bodyParser = require("body-parser");
/* Importing the ejs module. */
const ejs = require("ejs");

/* Creating an instance of the express module. */
const app = express();

/* Setting the view engine to ejs. */
app.set("view engine", "ejs");

/* A middleware that parses the body of the request. */
app.use(bodyParser.urlencoded({ extended: true }));
/* Telling the server to use the public folder as a static folder. */
app.use(express.static("public"));

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

/* Telling the server to listen on port 3000. */
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
